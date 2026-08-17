import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/lib/tokenStorage'
import type { ApiErrorResponse, AuthTokens } from '@/types/auth'

export const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const apiClient = axios.create({ baseURL })

let accessToken: string | null = null
let onAuthFailure: (() => void) | null = null
let refreshPromise: Promise<string> | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function setOnAuthFailure(handler: (() => void) | null): void {
  onAuthFailure = handler
}

async function performRefresh(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post<AuthTokens>(`${baseURL}/api/auth/refresh`, { refreshToken })
  accessToken = response.data.accessToken
  tokenStorage.setRefreshToken(response.data.refreshToken)
  return response.data.accessToken
}

/**
 * Refreshes the access token, deduping concurrent calls (e.g. two requests hitting 401 at once,
 * or React StrictMode double-invoking an effect) so only one /api/auth/refresh request is ever
 * in flight. Only a definite 401 (refresh token invalid/expired/reused) clears the session —
 * transient failures (network error, 5xx) are left for the caller to retry without destroying an
 * otherwise-valid refresh token.
 */
export function refreshAccessToken(): Promise<string> {
  refreshPromise ??= performRefresh()
    .catch((error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        accessToken = null
        tokenStorage.clear()
        onAuthFailure?.()
      }
      throw error
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return config
})

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as RetriableConfig | undefined
    const isAuthEndpoint = config?.url?.startsWith('/api/auth/')

    if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
      return Promise.reject(error)
    }

    config._retried = true

    const newAccessToken = await refreshAccessToken()
    config.headers.set('Authorization', `Bearer ${newAccessToken}`)
    return apiClient(config)
  },
)

export function extractErrorMessage(
  error: unknown,
  fallback = 'Ocorreu um erro inesperado',
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error) && error.response?.data?.message) {
    return error.response.data.message
  }
  return fallback
}

export function extractFieldErrors(error: unknown): Record<string, string> {
  if (axios.isAxiosError<ApiErrorResponse>(error) && error.response?.data?.fieldErrors) {
    return error.response.data.fieldErrors
  }
  return {}
}

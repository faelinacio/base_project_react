import { apiClient } from '@/lib/apiClient'
import type { AuthTokens, LoginResult } from '@/types/auth'

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface TotpLoginPayload {
  mfaToken: string
  code: string
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>('/api/auth/register', payload)
    return data
  },

  async login(payload: LoginPayload): Promise<LoginResult> {
    const { data } = await apiClient.post<LoginResult>('/api/auth/login', payload)
    return data
  },

  async loginTotp(payload: TotpLoginPayload): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>('/api/auth/login/totp', payload)
    return data
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/api/auth/logout', { refreshToken })
  },

  async resendVerification(email: string): Promise<void> {
    await apiClient.post('/api/auth/resend-verification', { email })
  },
}

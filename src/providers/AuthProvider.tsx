import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiClient, setAccessToken, setOnAuthFailure } from '@/lib/apiClient'
import { tokenStorage } from '@/lib/tokenStorage'
import { AuthContext, type AuthContextValue, type LoginOutcome } from '@/hooks/auth-context'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import type { AuthTokens, User } from '@/types/auth'

async function applyTokens(tokens: AuthTokens, setUser: (user: User) => void): Promise<void> {
  setAccessToken(tokens.accessToken)
  tokenStorage.setRefreshToken(tokens.refreshToken)
  const user = await userService.getCurrentUser()
  setUser(user)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => tokenStorage.getRefreshToken() !== null)

  const clearSession = useCallback(() => {
    setAccessToken(null)
    tokenStorage.clear()
    setUser(null)
  }, [])

  useEffect(() => {
    setOnAuthFailure(clearSession)
    return () => setOnAuthFailure(null)
  }, [clearSession])

  useEffect(() => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      return
    }

    apiClient
      .post<AuthTokens>('/api/auth/refresh', { refreshToken })
      .then(({ data }) => applyTokens(data, setUser))
      .catch(clearSession)
      .finally(() => setIsLoading(false))
  }, [clearSession])

  const login = useCallback(async (email: string, password: string): Promise<LoginOutcome> => {
    const result = await authService.login({ email, password })
    if (result.mfaRequired) {
      return { mfaRequired: true, mfaToken: result.mfaToken }
    }
    if (result.tokens) {
      await applyTokens(result.tokens, setUser)
    }
    return { mfaRequired: false, mfaToken: null }
  }, [])

  const loginTotp = useCallback(async (mfaToken: string, code: string) => {
    const tokens = await authService.loginTotp({ mfaToken, code })
    await applyTokens(tokens, setUser)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const tokens = await authService.register({ name, email, password })
    await applyTokens(tokens, setUser)
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (refreshToken) {
      await authService.logout(refreshToken).catch(() => undefined)
    }
    clearSession()
  }, [clearSession])

  const refreshUser = useCallback(async () => {
    setUser(await userService.getCurrentUser())
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      loginTotp,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, loginTotp, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

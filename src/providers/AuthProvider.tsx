import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { refreshAccessToken, setAccessToken, setOnAuthFailure } from '@/lib/apiClient'
import { tokenStorage } from '@/lib/tokenStorage'
import { AuthContext, type AuthContextValue, type LoginOutcome } from '@/hooks/auth-context'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import type { AuthTokens, User } from '@/types/auth'

async function applyTokens(
  tokens: Pick<AuthTokens, 'accessToken' | 'refreshToken'>,
  setUser: (user: User) => void,
): Promise<void> {
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
    if (!tokenStorage.getRefreshToken()) {
      return
    }

    // refreshAccessToken() dedupes concurrent calls (e.g. React StrictMode's double effect
    // invocation in dev), so this never races itself into rotating the refresh token twice.
    // It only clears the session on a definite 401 (invalid refresh token) via onAuthFailure;
    // a transient failure (network error, 5xx) just leaves isLoading false without wiping an
    // otherwise-valid refresh token, so the user can retry on the next reload.
    refreshAccessToken()
      .then(() => userService.getCurrentUser())
      .then(setUser)
      .catch(() => undefined)
      .finally(() => setIsLoading(false))
  }, [])

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

  const applyGoogleTokens = useCallback(async (accessToken: string, refreshToken: string) => {
    await applyTokens({ accessToken, refreshToken }, setUser)
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
      applyGoogleTokens,
    }),
    [user, isLoading, login, loginTotp, register, logout, refreshUser, applyGoogleTokens],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

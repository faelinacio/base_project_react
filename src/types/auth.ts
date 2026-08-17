export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface LoginResult {
  mfaRequired: boolean
  mfaToken: string | null
  tokens: AuthTokens | null
}

export type Role = 'USER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface TotpSetup {
  secret: string
  qrCodeImage: string
}

export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  fieldErrors: Record<string, string> | null
}

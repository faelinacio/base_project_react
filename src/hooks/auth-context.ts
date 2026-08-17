import { createContext } from 'react'
import type { User } from '@/types/auth'

export interface LoginOutcome {
  mfaRequired: boolean
  mfaToken: string | null
}

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginOutcome>
  loginTotp: (mfaToken: string, code: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

import { ChakraProvider } from '@chakra-ui/react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { system } from '@/lib/theme'
import { AuthProvider } from '@/providers/AuthProvider'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import type { User } from '@/types/auth'
import { OAuth2CallbackPage } from './OAuth2CallbackPage'

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    loginTotp: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resendVerification: vi.fn(),
    verifyEmail: vi.fn(),
  },
}))

vi.mock('@/services/userService', () => ({
  userService: { getCurrentUser: vi.fn() },
}))

const stubUser: User = {
  id: '1',
  name: 'Ada',
  email: 'ada@example.com',
  role: 'USER',
  totpEnabled: false,
}

function renderCallback(entry = '/oauth2/callback') {
  return render(
    <ChakraProvider value={system}>
      <MemoryRouter initialEntries={[entry]}>
        <AuthProvider>
          <Routes>
            <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
            <Route path="/" element={<div>Home stub</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </ChakraProvider>,
  )
}

afterEach(() => {
  window.history.pushState({}, '', '/')
})

describe('OAuth2CallbackPage', () => {
  it('shows an error when Google reports a login failure', () => {
    renderCallback('/oauth2/callback?error=oauth2_login_failed')
    expect(screen.getByText(/não foi possível entrar com o google/i)).toBeInTheDocument()
  })

  it('shows an error when the callback has no usable tokens', () => {
    window.history.pushState({}, '', '/oauth2/callback')
    renderCallback()
    expect(screen.getByText(/link de retorno do google inválido/i)).toBeInTheDocument()
  })

  it('applies the tokens and redirects home on a plain login', async () => {
    vi.mocked(userService.getCurrentUser).mockResolvedValue(stubUser)
    window.history.pushState({}, '', '/oauth2/callback#accessToken=abc&refreshToken=xyz')

    renderCallback()

    expect(await screen.findByText('Home stub')).toBeInTheDocument()
    expect(userService.getCurrentUser).toHaveBeenCalled()
  })

  it('asks for a TOTP code when the account has 2FA enabled, then redirects home', async () => {
    vi.mocked(authService.loginTotp).mockResolvedValue({
      accessToken: 'abc',
      refreshToken: 'xyz',
      tokenType: 'Bearer',
      expiresIn: 900,
    })
    vi.mocked(userService.getCurrentUser).mockResolvedValue(stubUser)
    window.history.pushState({}, '', '/oauth2/callback#mfaRequired=true&mfaToken=mfa-token')

    renderCallback()

    const codeInput = await screen.findByLabelText(/código de verificação/i)
    const user = userEvent.setup()
    await user.type(codeInput, '123456')
    await user.click(screen.getByRole('button', { name: /verificar/i }))

    await waitFor(() =>
      expect(authService.loginTotp).toHaveBeenCalledWith({ mfaToken: 'mfa-token', code: '123456' }),
    )
    expect(await screen.findByText('Home stub')).toBeInTheDocument()
  })
})

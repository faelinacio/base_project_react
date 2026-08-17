import { ChakraProvider } from '@chakra-ui/react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { system } from '@/lib/theme'
import { authService } from '@/services/authService'
import { VerifyEmailPage } from './VerifyEmailPage'

vi.mock('@/services/authService', () => ({
  authService: {
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
  },
}))

function renderAt(path: string) {
  return render(
    <ChakraProvider value={system}>
      <MemoryRouter initialEntries={[path]}>
        <VerifyEmailPage />
      </MemoryRouter>
    </ChakraProvider>,
  )
}

describe('VerifyEmailPage', () => {
  it('shows an error when no token is present in the URL', () => {
    renderAt('/verify-email')
    expect(screen.getByText(/nenhum token foi informado/i)).toBeInTheDocument()
  })

  it('confirms the email when the token is valid', async () => {
    vi.mocked(authService.verifyEmail).mockResolvedValue(undefined)
    renderAt('/verify-email?token=valid-token')

    await waitFor(() => expect(authService.verifyEmail).toHaveBeenCalledWith('valid-token'))
    expect(await screen.findByText(/verificado com sucesso/i)).toBeInTheDocument()
  })

  it('offers to resend the link when the token is invalid, and sends on submit', async () => {
    vi.mocked(authService.verifyEmail).mockRejectedValue(new Error('invalid token'))
    vi.mocked(authService.resendVerification).mockResolvedValue(undefined)
    renderAt('/verify-email?token=expired-token')

    expect(await screen.findByLabelText(/e-mail/i)).toBeInTheDocument()

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/e-mail/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /reenviar link/i }))

    await waitFor(() =>
      expect(authService.resendVerification).toHaveBeenCalledWith('user@example.com'),
    )
    expect(await screen.findByText(/novo link de verificação foi enviado/i)).toBeInTheDocument()
  })
})

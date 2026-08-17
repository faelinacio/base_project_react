import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, Box, Button, Link as MuiLink, Paper, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { extractErrorMessage } from '@/lib/apiClient'

const credentialsSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

const totpSchema = z.object({
  code: z.string().min(6, 'O código deve ter 6 dígitos').max(6, 'O código deve ter 6 dígitos'),
})

type CredentialsForm = z.infer<typeof credentialsSchema>
type TotpForm = z.infer<typeof totpSchema>

export function LoginPage() {
  const { login, loginTotp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/'

  const [mfaToken, setMfaToken] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const credentialsForm = useForm<CredentialsForm>({ resolver: zodResolver(credentialsSchema) })
  const totpForm = useForm<TotpForm>({ resolver: zodResolver(totpSchema) })

  const onSubmitCredentials = async (values: CredentialsForm) => {
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      const result = await login(values.email, values.password)
      if (result.mfaRequired && result.mfaToken) {
        setMfaToken(result.mfaToken)
      } else {
        navigate(redirectTo, { replace: true })
      }
    } catch (error) {
      setErrorMessage(
        extractErrorMessage(error, 'Não foi possível entrar. Verifique suas credenciais.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitTotp = async (values: TotpForm) => {
    if (!mfaToken) return
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await loginTotp(mfaToken, values.code)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, 'Código inválido ou expirado.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {mfaToken ? 'Verificação em duas etapas' : 'Entrar'}
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {!mfaToken && (
          <Box
            component="form"
            onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)}
            noValidate
          >
            <TextField
              {...credentialsForm.register('email')}
              label="E-mail"
              type="email"
              fullWidth
              margin="normal"
              autoComplete="email"
              autoFocus
              error={Boolean(credentialsForm.formState.errors.email)}
              helperText={credentialsForm.formState.errors.email?.message}
            />
            <TextField
              {...credentialsForm.register('password')}
              label="Senha"
              type="password"
              fullWidth
              margin="normal"
              autoComplete="current-password"
              error={Boolean(credentialsForm.formState.errors.password)}
              helperText={credentialsForm.formState.errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              Entrar
            </Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Não tem uma conta?{' '}
              <MuiLink component={RouterLink} to="/register">
                Cadastre-se
              </MuiLink>
            </Typography>
          </Box>
        )}

        {mfaToken && (
          <Box component="form" onSubmit={totpForm.handleSubmit(onSubmitTotp)} noValidate>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Informe o código de 6 dígitos do seu aplicativo autenticador.
            </Typography>
            <TextField
              {...totpForm.register('code')}
              label="Código de verificação"
              fullWidth
              margin="normal"
              autoFocus
              slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }}
              error={Boolean(totpForm.formState.errors.code)}
              helperText={totpForm.formState.errors.code?.message}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              Verificar
            </Button>
            <Button
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => {
                setMfaToken(null)
                setErrorMessage(null)
              }}
            >
              Voltar
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

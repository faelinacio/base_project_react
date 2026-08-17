import { useState } from 'react'
import axios from 'axios'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { extractErrorMessage } from '@/lib/apiClient'
import { totpService } from '@/services/totpService'
import type { TotpSetup } from '@/types/auth'

type TotpEnabledState = 'unknown' | 'enabled' | 'disabled'
type TotpMode = 'idle' | 'enroll' | 'disable'

export function SettingsPage() {
  const { user } = useAuth()

  const [enabledState, setEnabledState] = useState<TotpEnabledState>('unknown')
  const [mode, setMode] = useState<TotpMode>('idle')
  const [setupData, setSetupData] = useState<TotpSetup | null>(null)
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) return null

  const resetTotpForm = () => {
    setMode('idle')
    setSetupData(null)
    setCode('')
  }

  const handleStartEnroll = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmitting(true)
    try {
      const data = await totpService.setup()
      setSetupData(data)
      setMode('enroll')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setEnabledState('enabled')
        setErrorMessage('A autenticação de dois fatores já está ativada nesta conta.')
      } else {
        setErrorMessage(
          extractErrorMessage(error, 'Não foi possível iniciar a configuração do 2FA.'),
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmEnable = async () => {
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await totpService.enable(code)
      setEnabledState('enabled')
      setSuccessMessage('Autenticação de dois fatores ativada com sucesso.')
      resetTotpForm()
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, 'Código inválido. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDisable = async () => {
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await totpService.disable(code)
      setEnabledState('disabled')
      setSuccessMessage('Autenticação de dois fatores desativada.')
      resetTotpForm()
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, 'Código inválido. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
        Configurações
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Perfil
          </Typography>
          <Stack spacing={1}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Nome
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                E-mail
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Perfil de acesso
              </Typography>
              <Box>
                <Chip label={user.role} size="small" />
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography variant="h6">Autenticação de dois fatores (2FA)</Typography>
            {enabledState === 'enabled' && <Chip label="Ativada" color="success" size="small" />}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Proteja sua conta exigindo um código do seu aplicativo autenticador a cada login.
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}

          {mode === 'idle' && enabledState !== 'enabled' && (
            <Button variant="contained" onClick={handleStartEnroll} disabled={isSubmitting}>
              Ativar 2FA
            </Button>
          )}

          {mode === 'idle' && enabledState === 'enabled' && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setMode('disable')}
              disabled={isSubmitting}
            >
              Desativar 2FA
            </Button>
          )}

          {mode === 'enroll' && setupData && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2">
                1. Escaneie o QR code abaixo com seu aplicativo autenticador (Google Authenticator,
                Authy, etc.).
              </Typography>
              <Box
                component="img"
                src={setupData.qrCodeImage}
                alt="QR code do TOTP"
                sx={{ width: 180, height: 180 }}
              />
              <Typography variant="body2">Ou digite o código manualmente:</Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  bgcolor: 'action.hover',
                  p: 1,
                  borderRadius: 1,
                  wordBreak: 'break-all',
                }}
              >
                {setupData.secret}
              </Typography>
              <Typography variant="body2">
                2. Informe o código de 6 dígitos gerado para confirmar:
              </Typography>
              <TextField
                label="Código de verificação"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }}
                sx={{ maxWidth: 220 }}
              />
              <Divider />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={handleConfirmEnable}
                  disabled={isSubmitting || code.length !== 6}
                >
                  Confirmar e ativar
                </Button>
                <Button onClick={resetTotpForm} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          )}

          {mode === 'disable' && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2">
                Informe um código atual do seu aplicativo autenticador para desativar o 2FA.
              </Typography>
              <TextField
                label="Código de verificação"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }}
                sx={{ maxWidth: 220 }}
              />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDisable}
                  disabled={isSubmitting || code.length !== 6}
                >
                  Confirmar desativação
                </Button>
                <Button onClick={resetTotpForm} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}

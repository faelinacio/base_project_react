import { useState } from 'react'
import axios from 'axios'
import {
  Badge,
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Image,
  Input,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react'
import { AlertMessage } from '@/components/AlertMessage'
import { useAuth } from '@/hooks/useAuth'
import { extractErrorMessage } from '@/lib/apiClient'
import { totpService } from '@/services/totpService'
import type { TotpSetup } from '@/types/auth'

type TotpMode = 'idle' | 'enroll' | 'disable'

export function SettingsPage() {
  const { user, refreshUser } = useAuth()

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
        await refreshUser()
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
      await refreshUser()
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
      await refreshUser()
      setSuccessMessage('Autenticação de dois fatores desativada.')
      resetTotpForm()
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, 'Código inválido. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Stack gap={6}>
      <Heading as="h1" size="xl">
        Configurações
      </Heading>

      <Card.Root>
        <Card.Body>
          <Heading as="h2" size="md" mb={3}>
            Perfil
          </Heading>
          <Stack gap={3}>
            <Box>
              <Text fontSize="xs" color="fg.muted">
                Nome
              </Text>
              <Text>{user.name}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="fg.muted">
                E-mail
              </Text>
              <Text>{user.email}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="fg.muted" mb={1}>
                Perfil de acesso
              </Text>
              <Badge>{user.role}</Badge>
            </Box>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body>
          <HStack justify="space-between" mb={1}>
            <Heading as="h2" size="md">
              Autenticação de dois fatores (2FA)
            </Heading>
            {user.totpEnabled && <Badge colorPalette="green">Ativada</Badge>}
          </HStack>
          <Text fontSize="sm" color="fg.muted" mb={4}>
            Proteja sua conta exigindo um código do seu aplicativo autenticador a cada login.
          </Text>

          {errorMessage && (
            <Box mb={4}>
              <AlertMessage status="error" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </AlertMessage>
            </Box>
          )}
          {successMessage && (
            <Box mb={4}>
              <AlertMessage status="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
              </AlertMessage>
            </Box>
          )}

          {mode === 'idle' && !user.totpEnabled && (
            <Button colorPalette="blue" onClick={handleStartEnroll} loading={isSubmitting}>
              Ativar 2FA
            </Button>
          )}

          {mode === 'idle' && user.totpEnabled && (
            <Button
              variant="outline"
              colorPalette="red"
              onClick={() => setMode('disable')}
              disabled={isSubmitting}
            >
              Desativar 2FA
            </Button>
          )}

          {mode === 'enroll' && setupData && (
            <Stack gap={4} mt={1}>
              <Text fontSize="sm">
                1. Escaneie o QR code abaixo com seu aplicativo autenticador (Google Authenticator,
                Authy, etc.).
              </Text>
              <Image src={setupData.qrCodeImage} alt="QR code do TOTP" boxSize="180px" />
              <Text fontSize="sm">Ou digite o código manualmente:</Text>
              <Text
                fontSize="sm"
                fontFamily="mono"
                bg="bg.muted"
                p={2}
                borderRadius="md"
                wordBreak="break-all"
              >
                {setupData.secret}
              </Text>
              <Text fontSize="sm">2. Informe o código de 6 dígitos gerado para confirmar:</Text>
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                maxW="220px"
              />
              <Separator />
              <HStack>
                <Button
                  colorPalette="blue"
                  onClick={handleConfirmEnable}
                  loading={isSubmitting}
                  disabled={code.length !== 6}
                >
                  Confirmar e ativar
                </Button>
                <Button variant="ghost" onClick={resetTotpForm} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </HStack>
            </Stack>
          )}

          {mode === 'disable' && (
            <Stack gap={4} mt={1}>
              <Text fontSize="sm">
                Informe um código atual do seu aplicativo autenticador para desativar o 2FA.
              </Text>
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                maxW="220px"
              />
              <HStack>
                <Button
                  colorPalette="red"
                  onClick={handleConfirmDisable}
                  loading={isSubmitting}
                  disabled={code.length !== 6}
                >
                  Confirmar desativação
                </Button>
                <Button variant="ghost" onClick={resetTotpForm} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </HStack>
            </Stack>
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { AlertMessage } from '@/components/AlertMessage'
import { TotpCodeForm } from '@/components/TotpCodeForm'
import { useAuth } from '@/hooks/useAuth'
import { extractErrorMessage } from '@/lib/apiClient'

type ParsedCallback =
  | { kind: 'error'; message: string }
  | { kind: 'mfa'; mfaToken: string }
  | { kind: 'tokens'; accessToken: string; refreshToken: string }

// Tokens travel in the URL fragment (never sent to any server), not the query string — see
// OAuth2LoginSuccessHandler on the backend. Query string only ever carries ?error=...
function parseCallback(search: string, hash: string): ParsedCallback {
  if (new URLSearchParams(search).get('error')) {
    return { kind: 'error', message: 'Não foi possível entrar com o Google.' }
  }

  const fragment = new URLSearchParams(hash.replace(/^#/, ''))
  const mfaToken = fragment.get('mfaToken')
  if (fragment.get('mfaRequired') === 'true' && mfaToken) {
    return { kind: 'mfa', mfaToken }
  }

  const accessToken = fragment.get('accessToken')
  const refreshToken = fragment.get('refreshToken')
  if (accessToken && refreshToken) {
    return { kind: 'tokens', accessToken, refreshToken }
  }

  return { kind: 'error', message: 'Link de retorno do Google inválido ou expirado.' }
}

export function OAuth2CallbackPage() {
  const { applyGoogleTokens, loginTotp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // window.location.hash rather than the react-router location: fragments never go through
  // react-router's own location tracking, only through the real browser URL.
  const parsed = useMemo(
    () => parseCallback(location.search, window.location.hash),
    [location.search],
  )

  const [tokenError, setTokenError] = useState<string | null>(null)
  const [totpError, setTotpError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (parsed.kind !== 'tokens') return

    applyGoogleTokens(parsed.accessToken, parsed.refreshToken)
      .then(() => navigate('/', { replace: true }))
      .catch((error: unknown) => {
        setTokenError(extractErrorMessage(error, 'Não foi possível concluir o login com Google.'))
      })
    // Runs once per mount: the tokens in the URL are single-use.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmitTotp = async (code: string) => {
    if (parsed.kind !== 'mfa') return
    setTotpError(null)
    setIsSubmitting(true)
    try {
      await loginTotp(parsed.mfaToken, code)
      navigate('/', { replace: true })
    } catch (error) {
      setTotpError(extractErrorMessage(error, 'Código inválido ou expirado.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const errorMessage = parsed.kind === 'error' ? parsed.message : (tokenError ?? totpError)

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      bg="bg.subtle"
    >
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        borderRadius="lg"
        boxShadow="lg"
        p={8}
        w="full"
        maxW="400px"
      >
        <Heading as="h1" size="lg" mb={4}>
          {parsed.kind === 'mfa' ? 'Verificação em duas etapas' : 'Entrando com Google'}
        </Heading>

        {errorMessage && (
          <Box mb={4}>
            <AlertMessage status="error">{errorMessage}</AlertMessage>
          </Box>
        )}

        {parsed.kind === 'tokens' && !tokenError && (
          <Text color="fg.muted">Concluindo o login...</Text>
        )}

        {parsed.kind === 'mfa' && (
          <TotpCodeForm isSubmitting={isSubmitting} onSubmit={onSubmitTotp} />
        )}

        {(parsed.kind === 'error' || tokenError) && (
          <Button asChild colorPalette="blue" w="full" mt={2}>
            <RouterLink to="/login">Voltar para o login</RouterLink>
          </Button>
        )}
      </Box>
    </Box>
  )
}

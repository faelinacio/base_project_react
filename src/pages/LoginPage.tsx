import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Box,
  Button,
  chakra,
  Field,
  Heading,
  Input,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink, useLocation, useNavigate, type Location } from 'react-router-dom'
import { AlertMessage } from '@/components/AlertMessage'
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
  const redirectTo = (location.state as { from?: Location } | null)?.from?.pathname ?? '/'

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
          {mfaToken ? 'Verificação em duas etapas' : 'Entrar'}
        </Heading>

        {errorMessage && (
          <Box mb={4}>
            <AlertMessage status="error">{errorMessage}</AlertMessage>
          </Box>
        )}

        {!mfaToken && (
          <chakra.form onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)} noValidate>
            <Field.Root invalid={Boolean(credentialsForm.formState.errors.email)} mb={4}>
              <Field.Label>E-mail</Field.Label>
              <Input
                {...credentialsForm.register('email')}
                type="email"
                autoComplete="email"
                autoFocus
              />
              {credentialsForm.formState.errors.email && (
                <Field.ErrorText>{credentialsForm.formState.errors.email.message}</Field.ErrorText>
              )}
            </Field.Root>
            <Field.Root invalid={Boolean(credentialsForm.formState.errors.password)} mb={2}>
              <Field.Label>Senha</Field.Label>
              <Input
                {...credentialsForm.register('password')}
                type="password"
                autoComplete="current-password"
              />
              {credentialsForm.formState.errors.password && (
                <Field.ErrorText>
                  {credentialsForm.formState.errors.password.message}
                </Field.ErrorText>
              )}
            </Field.Root>
            <Button
              type="submit"
              colorPalette="blue"
              w="full"
              size="lg"
              mt={2}
              loading={isSubmitting}
            >
              Entrar
            </Button>
            <Text fontSize="sm" mt={4} textAlign="center">
              Não tem uma conta?{' '}
              <ChakraLink asChild color="blue.600">
                <RouterLink to="/register">Cadastre-se</RouterLink>
              </ChakraLink>
            </Text>
          </chakra.form>
        )}

        {mfaToken && (
          <chakra.form onSubmit={totpForm.handleSubmit(onSubmitTotp)} noValidate>
            <Text fontSize="sm" color="fg.muted" mb={3}>
              Informe o código de 6 dígitos do seu aplicativo autenticador.
            </Text>
            <Field.Root invalid={Boolean(totpForm.formState.errors.code)} mb={2}>
              <Field.Label>Código de verificação</Field.Label>
              <Input {...totpForm.register('code')} autoFocus inputMode="numeric" maxLength={6} />
              {totpForm.formState.errors.code && (
                <Field.ErrorText>{totpForm.formState.errors.code.message}</Field.ErrorText>
              )}
            </Field.Root>
            <Button
              type="submit"
              colorPalette="blue"
              w="full"
              size="lg"
              mt={2}
              loading={isSubmitting}
            >
              Verificar
            </Button>
            <Button
              variant="ghost"
              w="full"
              mt={2}
              onClick={() => {
                setMfaToken(null)
                setErrorMessage(null)
              }}
            >
              Voltar
            </Button>
          </chakra.form>
        )}
      </Box>
    </Box>
  )
}

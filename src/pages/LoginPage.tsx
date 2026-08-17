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
import { TotpCodeForm } from '@/components/TotpCodeForm'
import { useAuth } from '@/hooks/useAuth'
import { baseURL, extractErrorMessage } from '@/lib/apiClient'

const credentialsSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

type CredentialsForm = z.infer<typeof credentialsSchema>

export function LoginPage() {
  const { login, loginTotp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: Location } | null)?.from?.pathname ?? '/'

  const [mfaToken, setMfaToken] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const credentialsForm = useForm<CredentialsForm>({ resolver: zodResolver(credentialsSchema) })

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

  const onSubmitTotp = async (code: string) => {
    if (!mfaToken) return
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await loginTotp(mfaToken, code)
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
            <Button asChild variant="outline" w="full" mt={4}>
              <a href={`${baseURL}/oauth2/authorization/google`}>Entrar com Google</a>
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
          <TotpCodeForm
            isSubmitting={isSubmitting}
            onSubmit={onSubmitTotp}
            onBack={() => {
              setMfaToken(null)
              setErrorMessage(null)
            }}
          />
        )}
      </Box>
    </Box>
  )
}

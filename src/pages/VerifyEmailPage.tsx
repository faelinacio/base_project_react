import { useEffect, useState } from 'react'
import { Box, Button, chakra, Field, Heading, Input, Text } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { AlertMessage } from '@/components/AlertMessage'
import { authService } from '@/services/authService'
import { extractErrorMessage } from '@/lib/apiClient'

const resendSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
})

type ResendForm = z.infer<typeof resendSchema>

type Status = 'verifying' | 'success' | 'error' | 'missing-token'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'missing-token')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resendSent, setResendSent] = useState(false)

  const resendForm = useForm<ResendForm>({ resolver: zodResolver(resendSchema) })

  useEffect(() => {
    if (!token) return

    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((error: unknown) => {
        setErrorMessage(extractErrorMessage(error, 'O link de verificação é inválido ou expirou.'))
        setStatus('error')
      })
  }, [token])

  const onResend = async (values: ResendForm) => {
    await authService.resendVerification(values.email)
    setResendSent(true)
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
        maxW="420px"
      >
        <Heading as="h1" size="lg" mb={4}>
          Verificação de e-mail
        </Heading>

        {status === 'verifying' && <Text color="fg.muted">Confirmando seu e-mail...</Text>}

        {status === 'success' && (
          <>
            <AlertMessage status="success">E-mail verificado com sucesso!</AlertMessage>
            <Button asChild colorPalette="blue" w="full" mt={4}>
              <RouterLink to="/login">Ir para o login</RouterLink>
            </Button>
          </>
        )}

        {(status === 'error' || status === 'missing-token') && (
          <>
            <AlertMessage status="error">
              {status === 'missing-token'
                ? 'Link de verificação inválido: nenhum token foi informado.'
                : errorMessage}
            </AlertMessage>

            {resendSent ? (
              <Text mt={4} color="fg.muted">
                Se o e-mail informado estiver cadastrado, um novo link de verificação foi enviado.
              </Text>
            ) : (
              <chakra.form onSubmit={resendForm.handleSubmit(onResend)} noValidate mt={4}>
                <Text fontSize="sm" color="fg.muted" mb={3}>
                  Informe seu e-mail para receber um novo link de verificação.
                </Text>
                <Field.Root invalid={Boolean(resendForm.formState.errors.email)} mb={2}>
                  <Field.Label>E-mail</Field.Label>
                  <Input {...resendForm.register('email')} type="email" autoComplete="email" />
                  {resendForm.formState.errors.email && (
                    <Field.ErrorText>{resendForm.formState.errors.email.message}</Field.ErrorText>
                  )}
                </Field.Root>
                <Button
                  type="submit"
                  colorPalette="blue"
                  w="full"
                  loading={resendForm.formState.isSubmitting}
                >
                  Reenviar link
                </Button>
              </chakra.form>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

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
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AlertMessage } from '@/components/AlertMessage'
import { useAuth } from '@/hooks/useAuth'
import { extractErrorMessage, extractFieldErrors } from '@/lib/apiClient'

const registerSchema = z
  .object({
    name: z.string().min(1, 'Informe o nome').max(255, 'O nome deve ter no máximo 255 caracteres'),
    email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido').max(255),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .refine((value) => new TextEncoder().encode(value).length <= 72, {
        message: 'A senha deve ter no máximo 72 bytes',
      }),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterForm) => {
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await registerUser(values.name, values.email, values.password)
      navigate('/', { replace: true, state: { justRegistered: true } })
    } catch (error) {
      const fieldErrors = extractFieldErrors(error)
      Object.entries(fieldErrors).forEach(([field, message]) => {
        if (field === 'name' || field === 'email' || field === 'password') {
          form.setError(field, { message })
        }
      })
      setErrorMessage(extractErrorMessage(error, 'Não foi possível criar a conta.'))
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
        maxW="420px"
      >
        <Heading as="h1" size="lg" mb={4}>
          Criar conta
        </Heading>

        {errorMessage && (
          <Box mb={4}>
            <AlertMessage status="error">{errorMessage}</AlertMessage>
          </Box>
        )}

        <chakra.form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Field.Root invalid={Boolean(form.formState.errors.name)} mb={4}>
            <Field.Label>Nome</Field.Label>
            <Input {...form.register('name')} autoComplete="name" autoFocus />
            {form.formState.errors.name && (
              <Field.ErrorText>{form.formState.errors.name.message}</Field.ErrorText>
            )}
          </Field.Root>
          <Field.Root invalid={Boolean(form.formState.errors.email)} mb={4}>
            <Field.Label>E-mail</Field.Label>
            <Input {...form.register('email')} type="email" autoComplete="email" />
            {form.formState.errors.email && (
              <Field.ErrorText>{form.formState.errors.email.message}</Field.ErrorText>
            )}
          </Field.Root>
          <Field.Root invalid={Boolean(form.formState.errors.password)} mb={4}>
            <Field.Label>Senha</Field.Label>
            <Input {...form.register('password')} type="password" autoComplete="new-password" />
            <Field.HelperText>Mínimo de 8 caracteres.</Field.HelperText>
            {form.formState.errors.password && (
              <Field.ErrorText>{form.formState.errors.password.message}</Field.ErrorText>
            )}
          </Field.Root>
          <Field.Root invalid={Boolean(form.formState.errors.confirmPassword)} mb={2}>
            <Field.Label>Confirmar senha</Field.Label>
            <Input
              {...form.register('confirmPassword')}
              type="password"
              autoComplete="new-password"
            />
            <Field.HelperText>Digite a mesma senha informada acima.</Field.HelperText>
            {form.formState.errors.confirmPassword && (
              <Field.ErrorText>{form.formState.errors.confirmPassword.message}</Field.ErrorText>
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
            Criar conta
          </Button>
          <Text fontSize="sm" mt={4} textAlign="center">
            Já tem uma conta?{' '}
            <ChakraLink asChild color="blue.600">
              <RouterLink to="/login">Entrar</RouterLink>
            </ChakraLink>
          </Text>
        </chakra.form>
      </Box>
    </Box>
  )
}

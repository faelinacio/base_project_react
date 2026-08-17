import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, Box, Button, Link as MuiLink, Paper, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Criar conta
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <TextField
            {...form.register('name')}
            label="Nome"
            fullWidth
            margin="normal"
            autoComplete="name"
            autoFocus
            error={Boolean(form.formState.errors.name)}
            helperText={form.formState.errors.name?.message}
          />
          <TextField
            {...form.register('email')}
            label="E-mail"
            type="email"
            fullWidth
            margin="normal"
            autoComplete="email"
            error={Boolean(form.formState.errors.email)}
            helperText={form.formState.errors.email?.message}
          />
          <TextField
            {...form.register('password')}
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            error={Boolean(form.formState.errors.password)}
            helperText={form.formState.errors.password?.message}
          />
          <TextField
            {...form.register('confirmPassword')}
            label="Confirmar senha"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            error={Boolean(form.formState.errors.confirmPassword)}
            helperText={form.formState.errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            Criar conta
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Já tem uma conta?{' '}
            <MuiLink component={RouterLink} to="/login">
              Entrar
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

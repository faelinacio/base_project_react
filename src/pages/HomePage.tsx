import { Alert, Paper, Stack, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { user } = useAuth()
  const location = useLocation()
  const justRegistered = Boolean(
    (location.state as { justRegistered?: boolean } | null)?.justRegistered,
  )

  return (
    <Stack spacing={3}>
      {justRegistered && (
        <Alert severity="success">
          Conta criada com sucesso! Enviamos um link de verificação para o seu e-mail.
        </Alert>
      )}
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Olá, {user?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Você está autenticado no base_project_react, integrado ao base_project_spring_boot.
        </Typography>
      </Paper>
    </Stack>
  )
}

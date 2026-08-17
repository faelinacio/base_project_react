import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { AlertMessage } from '@/components/AlertMessage'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { user } = useAuth()
  const location = useLocation()
  const justRegistered = Boolean(
    (location.state as { justRegistered?: boolean } | null)?.justRegistered,
  )

  return (
    <Stack gap={6}>
      {justRegistered && (
        <AlertMessage status="success">
          Conta criada com sucesso! Enviamos um link de verificação para o seu e-mail.
        </AlertMessage>
      )}
      <Box borderWidth="1px" borderColor="border" borderRadius="lg" p={8}>
        <Heading as="h1" size="xl" mb={2}>
          Olá, {user?.name}
        </Heading>
        <Text color="fg.muted">
          Você está autenticado no base_project_react, integrado ao base_project_spring_boot.
        </Text>
      </Box>
    </Stack>
  )
}

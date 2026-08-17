import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      <Heading size="3xl">404</Heading>
      <Text color="fg.muted">Página não encontrada.</Text>
      <Button asChild colorPalette="blue">
        <RouterLink to="/">Voltar para o início</RouterLink>
      </Button>
    </Box>
  )
}

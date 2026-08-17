import { Box, Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 600 }}>
        404
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Página não encontrada.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Voltar para o início
      </Button>
    </Box>
  )
}

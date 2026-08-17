import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { TopBar } from '@/components/TopBar'

export function Layout() {
  return (
    <div>
      <TopBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </div>
  )
}

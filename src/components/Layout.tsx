import { Container } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { TopBar } from '@/components/TopBar'

export function Layout() {
  return (
    <div>
      <TopBar />
      <Container maxW="768px" py={8}>
        <Outlet />
      </Container>
    </div>
  )
}

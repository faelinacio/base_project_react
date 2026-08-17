import { Navigate, Outlet } from 'react-router-dom'
import { FullScreenSpinner } from '@/components/FullScreenSpinner'
import { useAuth } from '@/hooks/useAuth'

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <FullScreenSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

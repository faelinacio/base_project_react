import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FullScreenSpinner } from '@/components/FullScreenSpinner'
import { useAuth } from '@/hooks/useAuth'

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <FullScreenSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

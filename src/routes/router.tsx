import { Suspense, type ReactNode } from 'react'
import { Backdrop, CircularProgress } from '@mui/material'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { PublicOnlyRoute } from '@/components/PublicOnlyRoute'
import { RequireAuth } from '@/components/RequireAuth'
import { HomePage, LoginPage, NotFoundPage, RegisterPage, SettingsPage } from '@/routes/lazyPages'

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    >
      {element}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: withSuspense(<LoginPage />) },
      { path: '/register', element: withSuspense(<RegisterPage />) },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: withSuspense(<HomePage />) },
          { path: 'settings', element: withSuspense(<SettingsPage />) },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
])

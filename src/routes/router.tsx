import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { FullScreenSpinner } from '@/components/FullScreenSpinner'
import { Layout } from '@/components/Layout'
import { PublicOnlyRoute } from '@/components/PublicOnlyRoute'
import { RequireAuth } from '@/components/RequireAuth'
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  OAuth2CallbackPage,
  RegisterPage,
  SettingsPage,
  VerifyEmailPage,
} from '@/routes/lazyPages'

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<FullScreenSpinner />}>{element}</Suspense>
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
  { path: '/verify-email', element: withSuspense(<VerifyEmailPage />) },
  { path: '/oauth2/callback', element: withSuspense(<OAuth2CallbackPage />) },
  { path: '*', element: withSuspense(<NotFoundPage />) },
])

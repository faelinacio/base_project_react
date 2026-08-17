import { ChakraProvider } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/providers/AuthProvider'
import { system } from '@/lib/theme'
import { router } from '@/routes/router'

function App() {
  return (
    <ChakraProvider value={system}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App

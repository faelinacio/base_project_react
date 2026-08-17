import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { system } from '@/lib/theme'
import { AuthProvider } from '@/providers/AuthProvider'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the integration message', () => {
    render(
      <ChakraProvider value={system}>
        <MemoryRouter>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </MemoryRouter>
      </ChakraProvider>,
    )
    expect(screen.getByText(/base_project_spring_boot/i)).toBeInTheDocument()
  })
})

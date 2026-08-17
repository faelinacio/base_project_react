import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '@/providers/AuthProvider'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the integration message', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(screen.getByText(/base_project_spring_boot/i)).toBeInTheDocument()
  })
})

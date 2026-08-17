import { apiClient } from '@/lib/apiClient'
import type { User } from '@/types/auth'

export const userService = {
  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<User>('/api/users/me')
    return data
  },
}

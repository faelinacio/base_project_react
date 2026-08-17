import { apiClient } from '@/lib/apiClient'
import type { TotpSetup } from '@/types/auth'

export const totpService = {
  async setup(): Promise<TotpSetup> {
    const { data } = await apiClient.post<TotpSetup>('/api/users/me/totp/setup')
    return data
  },

  async enable(code: string): Promise<void> {
    await apiClient.post('/api/users/me/totp/enable', { code })
  },

  async disable(code: string): Promise<void> {
    await apiClient.post('/api/users/me/totp/disable', { code })
  },
}

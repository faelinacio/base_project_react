import { Alert, CloseButton } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface AlertMessageProps {
  status: 'error' | 'success'
  onClose?: () => void
  children: ReactNode
}

export function AlertMessage({ status, onClose, children }: AlertMessageProps) {
  return (
    <Alert.Root status={status} borderRadius="md">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Description>{children}</Alert.Description>
      </Alert.Content>
      {onClose && <CloseButton size="sm" onClick={onClose} />}
    </Alert.Root>
  )
}

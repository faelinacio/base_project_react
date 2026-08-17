import {
  Avatar,
  Box,
  Button,
  HStack,
  Link as ChakraLink,
  Menu,
  Portal,
  Text,
} from '@chakra-ui/react'
import { LuLogOut, LuSettings } from 'react-icons/lu'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function TopBar() {
  const { user, logout } = useAuth()

  return (
    <Box as="header" bg="blue.600" color="white" px={4} py={3}>
      <HStack justify="space-between">
        <ChakraLink
          asChild
          fontWeight="bold"
          fontSize="lg"
          color="white"
          _hover={{ textDecoration: 'none', color: 'white' }}
        >
          <RouterLink to="/">base_project_react</RouterLink>
        </ChakraLink>

        <HStack gap={2}>
          <Button asChild variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.300' }}>
            <RouterLink to="/">Início</RouterLink>
          </Button>
          <Button asChild variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.300' }}>
            <RouterLink to="/settings">Configurações</RouterLink>
          </Button>

          {user && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Box
                  as="button"
                  ml={2}
                  borderRadius="full"
                  cursor="pointer"
                  aria-label="Menu do usuário"
                >
                  <Avatar.Root size="sm" bg="purple.500" color="white">
                    <Avatar.Fallback name={user.name || user.email} />
                  </Avatar.Root>
                </Box>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Box px={3} py={2}>
                      <Text fontSize="sm" fontWeight="semibold">
                        {user.name}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {user.email}
                      </Text>
                    </Box>
                    <Menu.Separator />
                    <Menu.Item value="settings" asChild>
                      <RouterLink to="/settings">
                        <LuSettings /> Configurações
                      </RouterLink>
                    </Menu.Item>
                    <Menu.Item value="logout" onSelect={() => logout()}>
                      <LuLogOut /> Sair
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </HStack>
      </HStack>
    </Box>
  )
}

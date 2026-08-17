import { Box, Spinner } from '@chakra-ui/react'

export function FullScreenSpinner() {
  return (
    <Box
      position="fixed"
      inset={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="blackAlpha.600"
      zIndex={1400}
    >
      <Spinner size="xl" color="white" />
    </Box>
  )
}

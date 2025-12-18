'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

// 1. Define a Modern Theme (Dark Mode optimized)
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: '#0f172a', // Deep elegant blue-black
        color: 'white',
      },
    },
  },
  fonts: {
    heading: 'var(--font-inter)',
    body: 'var(--font-inter)',
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}

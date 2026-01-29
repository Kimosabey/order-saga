import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers' // <--- Import this

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OrderSaga | Distributed Systems',
  description: 'Saga Pattern Visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers> {/* <--- Wrap everything here */}
          {children}
        </Providers>
      </body>
    </html>
  )
}

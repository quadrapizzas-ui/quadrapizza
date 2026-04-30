import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ProductsProvider } from '@/context/ProductsContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Quadra Pizza',
  description: 'La mejor pizzería y rotisería de Yocsina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-50 antialiased">
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </body>
    </html>
  )
}

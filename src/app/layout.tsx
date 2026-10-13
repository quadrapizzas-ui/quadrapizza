import type { Metadata } from 'next'
import './globals.css'
import { TabSync } from '@/components/shared/TabSync'
// Manual de uso route enabled


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
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-50 antialiased">
        <TabSync />
        {children}
      </body>
    </html>
  )
}

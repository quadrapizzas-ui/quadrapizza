import type { Metadata, Viewport } from 'next'
import './globals.css'
import { TabSync } from '@/components/shared/TabSync'
// Manual de uso route enabled

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://quadrapizza.com"),
  title: {
    default: "Quadra Pizza | Pizzería & Rotisería Artesanal en Yocsina",
    template: "%s | Quadra Pizza",
  },
  description: "Pedí online en Quadra Pizza. Pizzas artesanales rectangulares, sándwiches, lomos y menú del día con delivery en Yocsina, Malagueño y La Perla.",
  keywords: [
    "Quadra Pizza",
    "Pizzería Yocsina",
    "Pizzería Malagueño",
    "Delivery de pizzas Yocsina",
    "Lomos y burgers Yocsina",
    "Rotisería Yocsina Malagueño",
    "Pizzas artesanales",
    "Comida a domicilio Malagueño"
  ],
  authors: [{ name: "Quadra Pizza" }],
  creator: "Quadra Pizza",
  openGraph: {
    title: "Quadra Pizza | Pizzería & Rotisería Artesanal en Yocsina",
    description: "Pizzas artesanales rectangulares, lomos, burgers y rotisería con delivery en Yocsina y Malagueño. Mirá el catálogo y pedí al instante por WhatsApp.",
    url: "https://quadrapizza.com",
    siteName: "Quadra Pizza",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Quadra Pizza - Pizzería & Rotisería Artesanal",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quadra Pizza | Pizzería & Rotisería Artesanal en Yocsina",
    description: "Pizzas artesanales rectangulares, lomos, burgers y rotisería con delivery en Yocsina y Malagueño. Catálogo online rápido y directo.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="image_src" href="/og-image.jpg" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-50 antialiased">
        <TabSync />
        {children}
      </body>
    </html>
  )
}

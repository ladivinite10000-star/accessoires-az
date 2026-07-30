import type { Metadata } from "next"
import Script from 'next/script'
import { Inter, Playfair_Display } from "next/font/google"
import { ProductsProvider } from "@/lib/products-context"
import { CartProvider } from "@/lib/cart-context"
import { Analytics } from '@vercel/analytics/next'
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair"
})

export const metadata: Metadata = {
  title: "L'Art des Accessoires AZ | Boutique Premium",
  description: "Decouvrez notre collection exclusive d'accessoires premium. Livraison rapide partout en Cote d'Ivoire. Paiement a la livraison.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={${inter.variable} ${playfair.variable} scroll-smooth bg-background}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ProductsProvider>
          <CartProvider>
            {/* Bandeau promotionnel */}
            <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-xs sm:text-sm font-medium">
              Livraison Rapide & Paiement Cash a la Livraison partout a Abidjan et l&apos;interieur !
            </div>
            <main className="flex-grow">
              {children}
            </main>
          </CartProvider>
        </ProductsProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}

        <Script id="remove-v0-badge" strategy="afterInteractive">
          {`
            const observer = new MutationObserver(() => {
              const badge = document.querySelector('[data-v0-badge], a[href*="v0.dev"], a[href*="v0.app"]');
              if (badge) badge.remove();
            });
            observer.observe(document.body, { childList: true, subtree: true });
          `}
        </Script>

      </body>
    </html>
  )
}

"use client"

import { Header } from '@/components/header'
import { VisitorCount } from '@/components/visitor-count'
import { ProductCard } from '@/components/product-card'
import { PurchaseNotification } from '@/components/purchase-notification'
import { useProducts } from '@/lib/products-context'
import { Sparkles, MessageCircle, ChevronDown, Star, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const { products } = useProducts()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const reviews = [
    {
      name: "Kouassi Marie",
      location: "Abidjan, Cocody",
      date: "Il y a 2 jours",
      rating: 5,
      comment: "Franchement top ! Livraison reçue en moins de 24h à Cocody. Le produit est de super bonne qualité et le livreur était très courtois. Je recommande à 100%.",
      verified: true
    },
    {
      name: "Mamadou Traoré",
      location: "Yopougon, Abidjan",
      date: "Il y a 4 jours",
      rating: 5,
      comment: "J'étais un peu sceptique au début, mais j'ai pu vérifier mon colis avant de payer en espèces comme promis. Très pro, merci à l'équipe AZ !",
      verified: true
    },
    {
      name: "Awa Koné",
      location: "Bouaké",
      date: "Il y a une semaine",
      rating: 5,
      comment: "Le service client sur WhatsApp est ultra réactif. Article conforme aux photos et super pratique au quotidien. Merci pour le sérieux.",
      verified: true
    }
  ]

  const faqs = [
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Nous expédions rapidement vos commandes. Les délais de livraison varient généralement entre 24 et 48 heures selon votre localisation exacte."
    },
    {
      question: "Comment s'effectue le paiement ?",
      answer: "Le paiement se fait en cash (espèces) directement à la réception de votre commande. Vous ne payez qu'une fois le colis entre vos mains."
    },
    {
      question: "Puis-je vérifier mon colis avant de payer ?",
      answer: "Absolument ! Nous vous offrons la possibilité de vérifier le contenu de votre colis à la livraison pour vous assurer de la conformité de votre article en toute sérénité."
    },
    {
      question: "Comment fonctionne le service après-vente (SAV) ?",
      answer: "Notre équipe reste entièrement à votre disposition via notre support WhatsApp direct pour répondre à toutes vos questions, vous assister ou gérer toute demande relative à votre produit."
    }
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <PurchaseNotification />

      {/* Bouton WhatsApp Flottant et Fixe en bas à droite */}
      <a
        href="https://wa.me/2250503635887?text=Bonjour,%20je%20souhaite%20avoir%20plus%20d'informations%20sur%20vos%20produits."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discuter sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-sm font-semibold pl-0 group-hover:pl-2">
          Discuter
        </span>
      </a>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-center mb-8">
            <VisitorCount />
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Collection Premium 2026</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              L&apos;Art des{' '}
              <span className="text-primary underline decoration-primary/30 underline-offset-8">Accessoires</span>
              {' '}AZ
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
              LE DÉTAIL QUI CHANGE TOUT, LE PRODUIT QUI VOUS SIMPLIFIE LA VIE
            </p>

            <a 
              href="#products"
              className="inline-flex bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              Explorer la Collection
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos <span className="text-primary">Produits</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chaque article est soigneusement sélectionné pour vous offrir le meilleur en termes de qualité et de style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Qualité Premium</h3>
              <p className="text-muted-foreground text-sm">
                Produits sélectionnés avec soin pour une qualité exceptionnelle.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Livraison Rapide</h3>
              <p className="text-muted-foreground text-sm">
                Expédition dans tout le pays avec suivi de commande.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Support Client</h3>
              <p className="text-muted-foreground text-sm">
                Assistance disponible via WhatsApp pour toutes vos questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Avis de nos clients Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>Note globale de 4.9 / 5 basée sur +500 commandes</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ce que pensent nos <span className="text-primary">Clients</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Découvrez les retours authentiques de clients satisfaits à travers le pays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>

                  <p className="text-foreground text-sm leading-relaxed mb-6 italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{review.name}</h4>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </div>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Achat vérifié</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section en Accordéon */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Questions <span className="text-primary">Fréquentes</span>
            </h2>
            <p className="text-muted-foreground">
              Tout ce que vous devez savoir sur nos services et livraisons.
            </p>
          </div>
<div className="space-y-4">
  {faq.map((item, index) => (
    <div
      key={index}
      className="border border-border rounded-2xl overflow-hidden bg-card transition-all"
    >
      <button
        onClick={() => setOpenFaq(openFaq === index ? null : index)}
        className="w-full flex items-center justify-between p-5 text-left font-medium"
      >
        <span>{item.question}</span>
      <ChevronDown className="w-5 h-5 text-primary transition-transform duration-200" /> 
      {openFaq === index && (
        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border">
          {item.answer}
        </div>
      )}
    </div>
  ))}
</div>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-serif font-bold text-sm tracking-widest">AZ</span>
            </div>
            <span className="font-serif text-lg font-bold text-foreground">
              L&apos;Art des Accessoires AZ
            </span>
          </div>
          
          <div className="mb-4">
            <a 
              href="https://wa.me/2250503635887"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="font-medium">Assistant Client: +225 0503635887</span>
            </a>
          </div>
          
          <p className="text-muted-foreground text-sm">
            2026 L&apos;Art des Accessoires AZ. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

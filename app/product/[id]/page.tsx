"use client"

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { ImageCarousel } from '@/components/image-carousel'
import { CustomerReviews } from '@/components/customer-reviews'
import { PurchaseNotification } from '@/components/purchase-notification'
import { useProducts } from '@/lib/products-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check, Truck, Shield, CreditCard, ArrowLeft, AlertCircle, Sparkles, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { generateOrderId, downloadReceipt, generateWhatsAppLink, type OrderData } from '@/lib/order-utils'
import { use } from 'react'

const DELIVERY_ZONES = [
  { id: "adjame", name: "Adjame", fee: 1500 },
  { id: "attecoube", name: "Attecoube", fee: 1500 },
  { id: "cocody", name: "Cocody", fee: 1500 },
  { id: "koumassi", name: "Koumassi", fee: 1500 },
  { id: "marcory", name: "Marcory", fee: 1500 },
  { id: "plateau", name: "Plateau", fee: 1500 },
  { id: "portbouet", name: "Port-Bouet", fee: 1500 },
  { id: "treichville", name: "Treichville", fee: 1500 },
  { id: "yopougon", name: "Yopougon", fee: 1500 },
  { id: "vridi", name: "Vridi", fee: 1500 },
  { id: "riviera", name: "Riviera", fee: 1500 },
  { id: "bingerville", name: "Bingerville", fee: 2000 },
  { id: "ndotre", name: "N'dotre", fee: 2000 },
  { id: "anyama", name: "Anyama", fee: 2000 },
  { id: "interieur", name: "Interieur du pays", fee: 2500 },
]

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const { products } = useProducts()
  const product = products.find(p => p.id === id)
   
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phoneSecondary: '',
    deliveryZone: '',
  })
  const [quantity, setQuantity] = useState(1)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  if (!product) {
    notFound()
  }

  const selectedZone = DELIVERY_ZONES.find(z => z.id === formData.deliveryZone)
  const deliveryFee = selectedZone?.fee || 0
  const subtotal = product.price * quantity
  const grandTotal = subtotal + deliveryFee

  // Fonction maison pour créer de superbes feux d'artifice visuels
  const triggerFireworks = () => {
    const duration = 2.5 * 1000
    const animationEnd = Date.now() + duration
    
    // Création d'un conteneur temporaire pour les confettis CSS animés
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.inset = '0'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '9999'
    document.body.appendChild(container)

    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6']

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval)
        container.remove()
        return
      }

      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div')
        particle.style.position = 'absolute'
        particle.style.left = ${Math.random() * 100}%;
      particle.style.top = ${Math.random() * 50}%;
       particle.style.width = ${Math.random() * 8 + 4}px;
       particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        particle.style.borderRadius = '50%'
        particle.style.transition = 'all 1s ease-out'
        container.appendChild(particle)

        setTimeout(() => {
          
     particle.style.transform = translate(${ (Math.random() - 0.5) * 400 }px, ${ Math.random() * 400 + 100 }px) scale(0)`;
        }, 20)

        setTimeout(() => particle.remove(), 1000)
      }
    }, 150)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
     
    const orderId = generateOrderId()
    const newOrderData: OrderData = {
      orderId,
      name: formData.name,
      phone: formData.phone,
      phoneSecondary: formData.phoneSecondary || undefined,
      deliveryZone: selectedZone?.name || '',
      deliveryFee,
      paymentMethod: 'Paiement a la livraison',
      items: [{
        name: product.name,
        price: product.price,
        quantity: quantity
      }],
      subtotal: subtotal,
      total: grandTotal,
      date: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setOrderData(newOrderData)
    setOrderComplete(true)
    triggerFireworks()
  }

  const handleDownloadReceipt = () => {
    if (orderData) {
      downloadReceipt(orderData)
    }
  }

  const handleWhatsAppConfirm = () => {
    if (orderData) {
      window.open(generateWhatsAppLink(orderData), '_blank')
    }
  }

  const scrollToForm = () => {
    const formElement = document.getElementById('order-form-section')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Order confirmation view
  if (orderComplete && orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-card rounded-2xl border border-border p-8 text-center shadow-xl">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Félicitations ! Commande validée 🎉
            </h1>
            <p className="text-muted-foreground mb-6 text-base">
              Numéro de commande : <span className="text-primary font-bold text-lg">{orderData.orderId}</span>
            </p>

            {/* Order Summary Ultra Lisible */}
            <div className="bg-secondary/60 rounded-2xl p-6 mb-6 text-left border border-border">
              <h3 className="font-semibold text-foreground text-base mb-4 border-b border-border pb-2">Détails de votre facture</h3>
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm md:text-base mb-3">
                  <span className="text-foreground font-medium">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                  <span className="text-foreground font-bold">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total des articles</span>
                  <span className="text-foreground font-semibold">{orderData.subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frais de livraison ({orderData.deliveryZone})</span>
                  <span className="text-foreground font-semibold">{orderData.deliveryFee.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="border-t border-border/60 pt-3 mt-2 flex justify-between items-center">
                  <span className="text-foreground font-bold text-lg">Total à payer</span>
                  <span className="text-primary font-extrabold text-xl">{orderData.total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground">
              Mode de paiement : <span className="font-bold">Paiement en espèces à la livraison</span> 🚚
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleDownloadReceipt}
                variant="outline"
                className="w-full border-primary/40 hover:bg-primary/10 py-6 text-base font-semibold rounded-xl"
              >
                📥 Télécharger mon reçu officiel
              </Button>
              <Button 
                onClick={handleWhatsAppConfirm}
                className="w-full bg-green-600 hover:bg-green-700 h-auto min-h-[52px] py-3 px-4 whitespace-normal text-center leading-tight text-white font-bold text-base rounded-xl shadow-lg"
              >
                💬 Confirmer et valider votre commande sur WhatsApp
              </Button>
              <Link href="/" className="block pt-2">
                <Button variant="ghost" className="w-full text-muted-foreground">
                  Retour à la boutique
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <Header />
      <PurchaseNotification />

      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ImageCarousel images={product.images} productName={product.name} />
          </div>

          <div className="flex flex-col">
            {product.category && (
              <div className="mb-4">
                <span className="text-primary text-xs uppercase tracking-wider font-bold bg-primary/10 px-3 py-1 rounded-full">{product.category}</span>
              </div>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <p className="text-primary text-3xl font-extrabold">
                {product.price.toLocaleString('fr-FR')} FCFA
              </p>
              {product.oldPrice && (
                <p className="text-muted-foreground line-through text-lg font-medium">
                  {product.oldPrice.toLocaleString('fr-FR')} FCFA
                </p>
              )}
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed text-base">
              {product.description}
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">Le problème du quotidien</h3>
                    <p className="text-muted-foreground text-sm">
                      Fatigué(e) des solutions inefficaces, des pertes de temps ou du manque de fiabilité ? Il est temps d&apos;y remédier durablement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">Notre solution idéale</h3>
                    <p className="text-muted-foreground text-sm">
                      {product.name} a été spécialement conçu pour vous simplifier la vie, vous garantir un confort maximal et un résultat impeccable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                Caractéristiques techniques
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {product.story && (
              <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                  L&apos;histoire du produit
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.story}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Truck className="w-4 h-4 text-primary" />
                <span>Livraison rapide 24/48h</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Shield className="w-4 h-4 text-primary" />
                <span>Qualité garantie</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-12 mb-12">
            <CustomerReviews reviews={product.reviews} />
          </div>
        )}

        <div id="order-form-section" className="max-w-2xl mx-auto pt-6">
          <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
              Commander maintenant
            </h2>
            <p className="text-muted-foreground text-center mb-6 text-sm md:text-base">
              Remplissez le formulaire ci-dessous. Aucun paiement en ligne requis.
            </p>

            <div className="bg-secondary/60 rounded-2xl p-4 mb-6 flex items-center justify-between border border-border">
              <div>
                <p className="font-semibold text-foreground text-sm md:text-base">{product.name}</p>
                <p className="text-primary font-extrabold text-base">{product.price.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-xl"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-8 text-center text-foreground font-bold text-lg">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-xl"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground font-semibold">Nom complet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Kouassi Jean"
                  required
                  className="mt-1.5 h-12 rounded-xl text-base"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground font-semibold">Téléphone principal (WhatsApp/Appel) *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Ex: 07 XX XX XX XX"
                  required
                  className="mt-1.5 h-12 rounded-xl text-base"
                />
              </div>

              <div>
                <Label htmlFor="phoneSecondary" className="text-foreground font-semibold">Téléphone secondaire (Optionnel)</Label>
                <Input
                  id="phoneSecondary"
                  type="tel"
                  value={formData.phoneSecondary}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneSecondary: e.target.value }))}
                  placeholder="Ex: 05 XX XX XX XX"
                  className="mt-1.5 h-12 rounded-xl text-base"
                />
              </div>

              <div>
                <Label htmlFor="deliveryZone" className="text-foreground font-semibold">Commune / Zone de livraison *</Label>
                <Select
                  value={formData.deliveryZone}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryZone: value }))}
                  required
                >
                  <SelectTrigger className="mt-1.5 h-12 rounded-xl text-base">
                    <SelectValue placeholder="Sélectionnez votre zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_ZONES.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name} ({zone.fee.toLocaleString('fr-FR')} FCFA)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">Paiement à la livraison</p>
                  <p className="text-xs text-muted-foreground">Vous payez en espèces une fois le colis reçu entre vos mains.</p>
                </div>
              </div>

              <div className="bg-secondary/60 rounded-2xl p-4 border border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total ({quantity} article{quantity > 1 ? 's' : ''})</span>
                  <span className="text-foreground font-semibold">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span className="text-foreground font-semibold">
                    {deliveryFee > 0 ? ${deliveryFee.toLocaleString('fr-FR')} FCFA : 'À sélectionner'}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-1 flex justify-between items-center">
                  <span className="text-foreground font-bold text-base">Total à payer</span>
                  <span className="text-primary font-extrabold text-xl">{grandTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 h-14 text-lg font-bold rounded-2xl shadow-lg transition-all transform active:scale-95"
                disabled={!formData.name || !formData.phone || !formData.deliveryZone}
              >
                🎉 Valider ma commande
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Sticky CTA Mobile Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4 z-50 flex items-center justify-between shadow-2xl">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Prix total</p>
          <p className="text-primary font-extrabold text-lg">{product.price.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <Button 
          onClick={scrollToForm}
          className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Commander vite
        </Button>
      </div>
    </div>
  )
}

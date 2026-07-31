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
import { Check, Truck, Shield, CreditCard, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react'
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

  // Order confirmation view
  if (orderComplete && orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
              Commande enregistree !
            </h1>
            <p className="text-muted-foreground mb-6">
              Numero de commande : <span className="text-primary font-bold">{orderData.orderId}</span>
            </p>

            {/* Order Summary */}
            <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-3">Recapitulatif</h3>
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                  <span className="text-foreground">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="text-foreground">{orderData.subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-foreground">{orderData.deliveryFee.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{orderData.total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Mode de paiement : <span className="text-foreground font-medium">Paiement a la livraison</span>
            </p>

            <div className="space-y-3">
              <Button 
                onClick={handleDownloadReceipt}
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/10"
              >
                Telecharger mon recu
              </Button>
              <Button 
                onClick={handleWhatsAppConfirm}
                className="w-full bg-green-600 hover:bg-green-700 h-auto min-h-[48px] py-3 px-4 whitespace-normal text-center leading-tight"
              >
                Confirmer et valider votre commande sur WhatsApp
              </Button>
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full">
                  Retour a la boutique
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PurchaseNotification />

      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour a la boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Carousel */}
          <div>
            <ImageCarousel images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.category && (
              <div className="mb-4">
                <span className="text-primary text-sm font-medium">{product.category}</span>
              </div>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <p className="text-primary text-3xl font-bold">
                {product.price.toLocaleString('fr-FR')} FCFA
              </p>
              {product.oldPrice && (
                <p className="text-muted-foreground line-through text-xl">
                  {product.oldPrice.toLocaleString('fr-FR')} FCFA
                </p>
              )}
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* SCHEMA PERSUASIF : PROBLÈME -> SOLUTION -> CARACTÉRISTIQUES */}
            <div className="space-y-4 mb-6">
              {/* Le Problème */}
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

              {/* La Solution */}
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

            {/* Features (Caractéristiques techniques) */}
            <div className="mb-6 bg-card rounded-2xl border border-border p-6">
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

            {/* Story */}
            {product.story && (
              <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                  L&apos;histoire du produit
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.story}
                </p>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-primary" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Qualite garantie</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Paiement a la livraison</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews specifiques au produit */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-12 mb-12">
            <CustomerReviews reviews={product.reviews} />
          </div>
        )}

        {/* Order Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2 text-center">
              Commander ce produit
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Remplissez le formulaire ci-dessous pour passer votre commande
            </p>

            {/* Quantity Selector */}
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{product.name}</p>
                  <p className="text-primary font-bold">{product.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center text-foreground font-semibold">{quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Votre nom complet"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telephone principal *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Ex: 07 XX XX XX XX"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phoneSecondary">Telephone secondaire (optionnel)</Label>
                <Input
                  id="phoneSecondary"
                  type="tel"
                  value={formData.phoneSecondary}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneSecondary: e.target.value }))}
                  placeholder="Ex: 05 XX XX XX XX"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="deliveryZone">Zone de livraison *</Label>
                <Select
                  value={formData.deliveryZone}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryZone: value }))}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selectionnez votre zone" />
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

              {/* Payment Method - Cash on Delivery */}
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Paiement a la livraison</p>
                    <p className="text-sm text-muted-foreground">Payez en especes a la reception de votre commande</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Sous-total ({quantity} article{quantity > 1 ? 's' : ''})</span>
                  <span className="text-foreground">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-foreground">
                    {deliveryFee > 0 ? ${deliveryFee.toLocaleString('fr-FR')} FCFA : 'Selectionnez une zone'}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-foreground">Total a payer</span>
                    <span className="text-primary">{grandTotal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 py-6 text-lg font-semibold rounded-2xl"
                disabled={!formData.name || !formData.phone || !formData.deliveryZone}
              >
                Valider ma commande
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

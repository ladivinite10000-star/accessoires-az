import type { Product } from "./products"

interface OrderItem {
  name: string
  price: number
  quantity: number
}

export interface OrderData {
  orderId: string
  name: string
  phone: string
  phoneSecondary?: string
  deliveryZone: string
  deliveryFee: number
  paymentMethod: string
  items: OrderItem[]
  subtotal: number
  total: number
  date: string
}

// Formatage standard des prix en Afrique de l'Ouest
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

// Generer un ID de commande unique
export function generateOrderId(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `AZ-${dateStr}-${random}`
}

// Genere le texte parfait pour WhatsApp (facile a lire pour le livreur)
export function generateWhatsAppMessage(order: OrderData): string {
  const line = "========================="
  let message = `*NOUVELLE COMMANDE SUR LE SITE* \n${line}\n\n`
  
  message += `*Client :* ${order.name}\n`
  message += `*Telephone :* ${order.phone}\n`
  if (order.phoneSecondary) {
    message += `*Tel. secondaire :* ${order.phoneSecondary}\n`
  }
  message += `*Zone de livraison :* ${order.deliveryZone}\n\n${line}\n\n`
  
  message += `*Articles commandes :*\n`
  order.items.forEach((item) => {
    message += `- ${item.name} (x${item.quantity}) : ${formatPrice(item.price * item.quantity)}\n`
  })
  
  message += `\n${line}\n`
  message += `*Sous-total :* ${formatPrice(order.subtotal)}\n`
  message += `*Livraison :* ${formatPrice(order.deliveryFee)}\n`
  message += `*TOTAL A PAYER :* *${formatPrice(order.total)}*\n\n`
  message += `*Numero de commande :* ${order.orderId}`
  
  return encodeURIComponent(message)
}

// Generer le lien WhatsApp
export function generateWhatsAppLink(order: OrderData): string {
  const phoneNumber = "2250503635887"
  const message = generateWhatsAppMessage(order)
  return `https://wa.me/${phoneNumber}?text=${message}`
}

// Telecharger le recu en texte
export function downloadReceipt(order: OrderData): void {
  const line = "========================="
  let receipt = `RECU DE COMMANDE\n${line}\n\n`
  receipt += `Numero: ${order.orderId}\n`
  receipt += `Date: ${order.date}\n\n`
  receipt += `Client: ${order.name}\n`
  receipt += `Telephone: ${order.phone}\n`
  if (order.phoneSecondary) {
    receipt += `Tel. secondaire: ${order.phoneSecondary}\n`
  }
  receipt += `Zone: ${order.deliveryZone}\n\n`
  receipt += `${line}\nARTICLES\n${line}\n\n`
  
  order.items.forEach((item) => {
    receipt += `${item.name}\n`
    receipt += `  Quantite: ${item.quantity}\n`
    receipt += `  Prix unitaire: ${formatPrice(item.price)}\n`
    receipt += `  Total: ${formatPrice(item.price * item.quantity)}\n\n`
  })
  
  receipt += `${line}\n`
  receipt += `Sous-total: ${formatPrice(order.subtotal)}\n`
  receipt += `Livraison: ${formatPrice(order.deliveryFee)}\n`
  receipt += `TOTAL: ${formatPrice(order.total)}\n`
  receipt += `${line}\n\n`
  receipt += `Mode de paiement: ${order.paymentMethod}\n\n`
  receipt += `Merci pour votre commande !\n`
  receipt += `L'Art des Accessoires AZ`
  
  const blob = new Blob([receipt], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recu-${order.orderId}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

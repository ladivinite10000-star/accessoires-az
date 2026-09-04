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

// Télécharger un reçu HTML lisible, avec les montants mis en évidence
export function downloadReceipt(order: OrderData): void {
  const escapeHtml = (value: string | number) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  const itemsHtml = order.items.map((item) => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${item.quantity}</td>
      <td>${formatPrice(item.price)}</td>
      <td class="amount">${formatPrice(item.price * item.quantity)}</td>
    </tr>`).join('')

  const receipt = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Reçu ${escapeHtml(order.orderId)}</title>
<style>
body{font-family:Arial,sans-serif;color:#172033;max-width:760px;margin:0 auto;padding:32px;line-height:1.5}
h1{font-size:28px;margin:0 0 4px}h2{font-size:18px;margin-top:28px;border-bottom:2px solid #172033;padding-bottom:8px}
.meta{color:#4b5563;margin-bottom:24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin:16px 0 24px}
strong{color:#172033}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{text-align:left;padding:12px 8px;border-bottom:1px solid #d1d5db}th{background:#eef2f7}.amount{font-weight:700;white-space:nowrap}
.totals{margin:24px 0 0 auto;max-width:360px}.total{font-size:22px;font-weight:800;color:#0b6b52;border-top:2px solid #172033;padding-top:12px}
@media print{body{padding:0}.no-print{display:none}}
</style></head><body>
<h1>Reçu officiel de commande</h1><div class="meta">Accessoires AZ · ${escapeHtml(order.date)}</div>
<div class="grid"><div><strong>Numéro :</strong> ${escapeHtml(order.orderId)}</div><div><strong>Client :</strong> ${escapeHtml(order.name)}</div><div><strong>Téléphone :</strong> ${escapeHtml(order.phone)}</div>${order.phoneSecondary ? `<div><strong>Téléphone secondaire :</strong> ${escapeHtml(order.phoneSecondary)}</div>` : ''}<div><strong>Zone :</strong> ${escapeHtml(order.deliveryZone)}</div></div>
<h2>Articles commandés</h2><table><thead><tr><th>Article</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr></thead><tbody>${itemsHtml}</tbody></table>
<div class="totals"><div>Sous-total : <strong>${formatPrice(order.subtotal)}</strong></div><div>Livraison : <strong>${formatPrice(order.deliveryFee)}</strong></div><div class="total">TOTAL À PAYER : ${formatPrice(order.total)}</div></div>
<h2>Paiement</h2><p>${escapeHtml(order.paymentMethod)}</p><p>Merci pour votre commande !<br><strong>L'Art des Accessoires AZ</strong></p>
</body></html>`

  const blob = new Blob([receipt], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `recu-${order.orderId}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

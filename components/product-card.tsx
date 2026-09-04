"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className="group relative bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Détails toujours visibles, avec un renforcement au survol */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
            <span className={`bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold shadow-lg transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
              Voir les détails de l&apos;article
            </span>
          </div>

          {/* Badge promo si ancien prix */}
          {product.oldPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-primary font-bold text-xl">
              {product.price.toLocaleString('fr-FR')} FCFA
            </p>
            {product.oldPrice && (
              <p className="text-muted-foreground line-through text-sm">
                {product.oldPrice.toLocaleString('fr-FR')} FCFA
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

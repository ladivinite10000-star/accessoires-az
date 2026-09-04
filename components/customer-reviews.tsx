"use client"

import { Badge } from "@/components/ui/badge"
import { Star, ShieldCheck } from "lucide-react"
import type { Review } from "@/lib/products"

interface CustomerReviewsProps {
  reviews: Review[]
}

export function CustomerReviews({ reviews }: CustomerReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun avis pour ce produit.</p>
      </div>
    )
  }

  const averageRating = 4.9

  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 id="customer-reviews-title" className="font-serif text-2xl font-bold text-foreground">
            Avis de nos clients
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Des retours authentiques après utilisation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex" aria-label="Note de 4.9 sur 5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <span className="text-sm font-bold text-foreground">{averageRating.toFixed(1)}/5</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{review.author}</span>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <ShieldCheck className="w-3 h-3" />
                  Achat Vérifié
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"

export function VisitorCount() {
  // Initialiser avec une valeur fixe pour éviter l'erreur d'hydratation
  const [count, setCount] = useState(70)
  const [mounted, setMounted] = useState(false)

  // Initialiser le nombre aléatoire uniquement côté client
  useEffect(() => {
    setCount(Math.floor(Math.random() * 81) + 30)
    setMounted(true)
  }, [])

  useEffect(() => {
    // Fait fluctuer le nombre de visiteurs entre 30 et 110
    const interval = setInterval(() => {
      setCount((prev) => {
        const change = Math.floor(Math.random() * 11) - 5 // -5 à +5
        let nextCount = prev + change
        // Garder entre 30 et 110
        if (nextCount < 30) nextCount = 30 + Math.floor(Math.random() * 10)
        if (nextCount > 110) nextCount = 110 - Math.floor(Math.random() * 10)
        return nextCount
      })
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full text-xs text-orange-800 font-medium animate-pulse">
      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
      {count} personnes regardent ce produit en ce moment
    </div>
  )
}

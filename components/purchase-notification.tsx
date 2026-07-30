"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/lib/products-context"

export function PurchaseNotification() {
  const { products } = useProducts()
  const [notification, setNotification] = useState<{ name: string; productName: string; city: string } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Communes d'Abidjan
  const communesAbidjan = [
    "Cocody", "Yopougon", "Marcory", "Treichville", "Adjame", 
    "Plateau", "Koumassi", "Port-Bouet", "Bingerville", "Anyama",
    "Abobo", "Attécoubé", "Songon"
  ]

  // Villes de l'intérieur de la Côte d'Ivoire
  const villesInterieur = [
    "Yamoussoukro", "Bouaké", "San Pedro", "Daloa", "Korhogo",
    "Man", "Gagnoa", "Abengourou", "Divo", "Séguéla", "Odienné",
    "Bondoukou", "Ferkessédougou", "Soubré", "Issia", "Duékoué",
    "Bouaflé", "Bongouanou", "Agnibilékrou", "Dimbokro", "Toumodi",
    "Lakota", "Sinfra", "Oumé", "Tiassalé", "Agboville", "Adzopé",
    "Grand-Bassam", "Dabou", "Jacqueville", "Grand-Lahou", "Sassandra",
    "Tabou", "Guiglo", "Danané", "Bangolo", "Biankouma", "Touba",
    "Katiola", "Dabakala", "Niakaramandougou", "Tafiré", "Kong",
    "Bouna", "Tanda", "Koun-Fao", "Bocanda", "M'Bahiakro", "Prikro",
    "Tiébissou", "Zuénoula", "Vavoua", "Mankono", "Tengréla"
  ]

  // Toutes les villes combinées
  const allCities = [...communesAbidjan, ...villesInterieur]

  // Liste de prénoms ivoiriens demandés
  const firstNames = [
    "Justin", "Jacqueline", "Franklin", "Clémentine", "Jordan", "Ismaël",
    "Fadel", "Yves", "Mariette", "Elodie", "Pacôme", "Eliza", "Crépin",
    "Alain", "Eric", "Emilienne", "Safi", "Raphael", "Herman", "Alex",
    "Dramane", "Awa", "Mira", "Joel", "Rayane", "Sylvain", "Judith",
    "Désiré", "Léonce", "Romuald", "Fernand", "Pierre", "Paul", "Martial",
    "Colette", "Isidore", "Véronique", "Apolline", "Blaise", "Gaston",
    "Eugénie", "Gauthier", "Bérenger", "Augustin", "Germain"
  ]

  useEffect(() => {
    // Ne pas afficher si pas de produits
    if (products.length === 0) return

    const showNotification = () => {
      // Choisir un produit aléatoire UNIQUEMENT parmi les produits du catalogue
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      const randomCity = allCities[Math.floor(Math.random() * allCities.length)]
      const randomName = firstNames[Math.floor(Math.random() * firstNames.length)]

      setNotification({
        name: randomName,
        city: randomCity,
        productName: randomProduct.name
      })
      setIsVisible(true)

      // Cacher après 5 secondes
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }

    // Première notification après 10 secondes
    const initialTimer = setTimeout(showNotification, 10000)

    // Notifications suivantes toutes les 1 minute (60000ms)
    const interval = setInterval(showNotification, 60000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [products])

  if (!isVisible || !notification) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-left-full duration-500">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {notification.name} de {notification.city}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              vient d&apos;acheter
            </p>
            <p className="text-sm text-primary font-semibold mt-1 truncate">
              {notification.productName}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Il y a quelques instants
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

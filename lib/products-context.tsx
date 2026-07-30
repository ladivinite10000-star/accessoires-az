"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Product } from '@/lib/products'
import { products as initialProducts } from '@/lib/products'

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'reviews'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('az-products')
    if (stored) {
      try {
        const parsedProducts = JSON.parse(stored)
        // Fusionner avec les produits initiaux pour s'assurer que les nouvelles donnees sont incluses
        setProducts(parsedProducts)
      } catch {
        setProducts(initialProducts)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('az-products', JSON.stringify(products))
    // Declencher un evenement pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('products-updated', { detail: products }))
  }, [products])

  const addProduct = (product: Omit<Product, 'id' | 'reviews'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      reviews: []
    }
    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ))
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}

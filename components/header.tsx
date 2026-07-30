"use client"

import Link from 'next/link'
import { ShoppingBag, Menu, X, Shield, Phone, Lock } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const { itemCount } = useCart()
  const router = useRouter()

  const handleAdminAccess = () => {
    if (adminPassword === '45236') {
      setShowAdminDialog(false)
      setAdminPassword('')
      setPasswordError(false)
      router.push('/admin')
    } else {
      setPasswordError(true)
    }
  }

  const openAdminDialog = () => {
    setIsMenuOpen(false)
    setShowAdminDialog(true)
    setPasswordError(false)
    setAdminPassword('')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">AZ</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-lg font-bold text-foreground leading-tight">
                  L&apos;Art des Accessoires
                </h1>
                <p className="text-xs text-muted-foreground">Collection Premium</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link href="/#products" className="text-foreground hover:text-primary transition-colors">
                Produits
              </Link>
              <a 
                href="https://wa.me/2250503635887" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+225 0503635887</span>
              </a>
              <button 
                onClick={openAdminDialog}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Shield className="w-4 h-4" />
              </button>
            </nav>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Link href="/checkout">
                <Button variant="outline" size="icon" className="relative border-primary/30 hover:bg-primary/10">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu avec le bouton Admin */}
          {isMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 border-t border-border mt-4 flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/#products" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Produits
              </Link>
              <a 
                href="https://wa.me/2250503635887" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-4 h-4" />
                <span>+225 0503635887</span>
              </a>
              {/* Bouton Admin dans le menu mobile */}
              <button 
                onClick={openAdminDialog}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-left"
              >
                <Shield className="w-4 h-4" />
                <span>Administration</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Dialog pour le mot de passe admin */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Acces Administration
            </DialogTitle>
            <DialogDescription>
              Entrez le mot de passe pour acceder au tableau de bord administrateur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="Mot de passe"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value)
                setPasswordError(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdminAccess()
                }
              }}
              className={passwordError ? 'border-red-500' : ''}
            />
            {passwordError && (
              <p className="text-sm text-red-500">Mot de passe incorrect</p>
            )}
            <Button onClick={handleAdminAccess} className="w-full">
              Acceder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

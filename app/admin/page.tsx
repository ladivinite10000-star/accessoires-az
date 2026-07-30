"use client"

import { useState, useRef } from "react"
import { useProducts } from "@/lib/products-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit, Save, X, ImagePlus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/products"

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Product>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newImages, setNewImages] = useState<string[]>([])

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    story: '',
    features: '',
    images: [] as string[],
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        if (isEdit) {
          setNewImages(prev => [...prev, base64])
        } else {
          setNewProduct(prev => ({
            ...prev,
            images: [...prev.images, base64]
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return

    addProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: parseInt(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseInt(newProduct.oldPrice) : undefined,
      category: newProduct.category,
      story: newProduct.story,
      features: newProduct.features.split('\n').filter(f => f.trim()),
      images: newProduct.images.length > 0 ? newProduct.images : [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
      ],
      stock: 10,
    })

    setNewProduct({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      story: '',
      features: '',
      images: [],
    })
    setShowAddForm(false)
  }

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category,
      story: product.story,
      features: product.features,
      images: product.images,
      stock: product.stock,
    })
    setNewImages([])
  }

  const saveEdit = () => {
    if (!editingId) return
    
    const updatedImages = [...(editForm.images || []), ...newImages]
    updateProduct(editingId, {
      ...editForm,
      images: updatedImages.length > 0 ? updatedImages : editForm.images
    })
    setEditingId(null)
    setEditForm({})
    setNewImages([])
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
    setNewImages([])
  }

  const removeImage = (index: number, isNew = false) => {
    if (isNew) {
      setNewImages(prev => prev.filter((_, i) => i !== index))
    } else {
      setEditForm(prev => ({
        ...prev,
        images: (prev.images || []).filter((_, i) => i !== index)
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour a la boutique
            </Link>
            <h1 className="font-serif text-3xl font-bold text-foreground">Administration</h1>
            <p className="text-muted-foreground">Gerez vos produits et votre catalogue</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </Button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">Nouveau produit</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nom du produit *</Label>
                <Input 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du produit"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Categorie</Label>
                <Input 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex: Accessoires Tech"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Prix (FCFA) *</Label>
                <Input 
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="15000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Ancien prix (FCFA)</Label>
                <Input 
                  type="number"
                  value={newProduct.oldPrice}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, oldPrice: e.target.value }))}
                  placeholder="22000"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du produit"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Histoire du produit</Label>
                <Textarea 
                  value={newProduct.story}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, story: e.target.value }))}
                  placeholder="L'histoire derriere ce produit..."
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Caracteristiques (une par ligne)</Label>
                <Textarea 
                  value={newProduct.features}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="Caracteristique 1&#10;Caracteristique 2&#10;Caracteristique 3"
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Images</Label>
                <div className="mt-2 flex flex-wrap gap-4">
                  {newProduct.images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                      <Image src={img} alt="" fill className="object-cover" />
                      <button
                        onClick={() => setNewProduct(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, false)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddProduct}>Ajouter le produit</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Annuler</Button>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-2xl p-6">
              {editingId === product.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Nom</Label>
                      <Input 
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Categorie</Label>
                      <Input 
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Prix (FCFA)</Label>
                      <Input 
                        type="number"
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input 
                        type="number"
                        value={editForm.stock || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea 
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Images actuelles</Label>
                      <div className="mt-2 flex flex-wrap gap-4">
                        {(editForm.images || []).map((img, index) => (
                          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                            <Image src={img} alt="" fill className="object-cover" />
                            <button
                              onClick={() => removeImage(index, false)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {newImages.map((img, index) => (
                          <div key={`new-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-green-500">
                            <Image src={img} alt="" fill className="object-cover" />
                            <button
                              onClick={() => removeImage(index, true)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <ImagePlus className="w-6 h-6 text-muted-foreground" />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, true)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} className="gap-2">
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="gap-2">
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={product.images[0]} 
                      alt={product.name}
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-primary font-bold">{product.price.toLocaleString('fr-FR')} FCFA</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock} | {product.images.length} image(s)</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => startEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        if (confirm('Supprimer ce produit ?')) {
                          deleteProduct(product.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <p className="text-muted-foreground">Aucun produit dans le catalogue.</p>
              <Button onClick={() => setShowAddForm(true)} className="mt-4">
                Ajouter votre premier produit
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

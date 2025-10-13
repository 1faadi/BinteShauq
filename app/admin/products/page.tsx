"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  collection: string
  inStock: boolean
  createdAt: string
  updatedAt: string
  // Additional attributes from pd.md
  articleName?: string
  color?: string
  fabric?: string
  embroidery?: string
  shawlLength?: string
  suitFabric?: string
  usage?: string
  care?: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Product deleted successfully")
        fetchProducts()
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product")
    }
  }

  const handleToggleStock = async (productId: string, currentStock: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inStock: !currentStock,
        }),
      })

      if (response.ok) {
        toast.success("Product stock status updated")
        fetchProducts()
      } else {
        toast.error("Failed to update product stock")
      }
    } catch (error) {
      console.error("Failed to update product stock:", error)
      toast.error("Failed to update product stock")
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.collection.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Create a new product for your catalog
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-2">
                <ProductForm
                  onSuccess={() => {
                    setIsCreateDialogOpen(false)
                    fetchProducts()
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Badge variant="secondary">
              {filteredProducts.length} products
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            All products in your catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative h-12 w-12">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.description.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.collection}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    Rs. {product.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={product.inStock}
                        onCheckedChange={() => handleToggleStock(product.id, product.inStock)}
                      />
                      <span className="text-sm">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.slug}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingProduct(product)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            {editingProduct && (
              <ProductForm
                product={editingProduct}
                onSuccess={() => {
                  setIsEditDialogOpen(false)
                  setEditingProduct(null)
                  fetchProducts()
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Product Form Component
function ProductForm({ 
  product, 
  onSuccess 
}: { 
  product?: Product
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    collection: product?.collection || "",
    images: product?.images || [],
    inStock: product?.inStock ?? true,
    // Additional attributes from pd.md
    articleName: product?.articleName || "",
    color: product?.color || "",
    fabric: product?.fabric || "Staple Karrandi",
    embroidery: product?.embroidery || "Custom-designed premium threadwork",
    shawlLength: product?.shawlLength || "2.75 meters",
    suitFabric: product?.suitFabric || "unstitched 5-meter loose fabric",
    usage: product?.usage || "Shoulder Shawl",
    care: product?.care || "Dry Clean Only",
    isFeatured: (product as any)?.isFeatured || false,
    isNewArrival: (product as any)?.isNewArrival || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setUploadedImages(files)
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file))
      setImagePreview(previews)
    }
  }

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreview[index])
    
    setUploadedImages(newImages)
    setImagePreview(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = product ? "PUT" : "POST"

      // Convert images to base64 if uploaded
      let imageData = null
      if (uploadedImages.length > 0) {
        const base64Images = await Promise.all(
          uploadedImages.map(file => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(file)
            })
          })
        )
        imageData = JSON.stringify(base64Images)
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageData,
          uploadedImagesCount: uploadedImages.length,
        }),
      })

      if (response.ok) {
        toast.success(product ? "Product updated successfully" : "Product created successfully")
        onSuccess()
      } else {
        toast.error("Failed to save product")
      }
    } catch (error) {
      console.error("Failed to save product:", error)
      toast.error("Failed to save product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="articleName">Article Name</Label>
          <Input
            id="articleName"
            value={formData.articleName}
            onChange={(e) => setFormData({ ...formData, articleName: e.target.value })}
            placeholder="e.g., Sapphire Bloom"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (Rs.) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="e.g., Black"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="collection">Collection *</Label>
          <Select
            value={formData.collection}
            onValueChange={(value) => setFormData({ ...formData, collection: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blossom">Blossom</SelectItem>
              <SelectItem value="midnight">Midnight</SelectItem>
              <SelectItem value="moonlight">Moonlight</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fabric">Fabric</Label>
          <Input
            id="fabric"
            value={formData.fabric}
            onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="embroidery">Embroidery</Label>
          <Input
            id="embroidery"
            value={formData.embroidery}
            onChange={(e) => setFormData({ ...formData, embroidery: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="shawlLength">Shawl Length</Label>
          <Input
            id="shawlLength"
            value={formData.shawlLength}
            onChange={(e) => setFormData({ ...formData, shawlLength: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="suitFabric">Suit Fabric</Label>
          <Input
            id="suitFabric"
            value={formData.suitFabric}
            onChange={(e) => setFormData({ ...formData, suitFabric: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="usage">Usage</Label>
          <Input
            id="usage"
            value={formData.usage}
            onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="care">Care Instructions</Label>
        <Input
          id="care"
          value={formData.care}
          onChange={(e) => setFormData({ ...formData, care: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="images">Product Images</Label>
        <div className="space-y-4">
          <div>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Upload product images (JPG, PNG, WebP). You can select multiple files.
            </p>
          </div>
          
          {/* Image Previews */}
          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-lg border">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Fallback URL input for existing products */}
          {product && (
            <div>
              <Label htmlFor="imageUrls">Or use image URLs (comma-separated)</Label>
              <Input
                id="imageUrls"
                value={formData.images.join(", ")}
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split(", ").filter(Boolean) })}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="inStock"
          checked={formData.inStock}
          onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
        />
        <Label htmlFor="inStock">In Stock</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
          />
          <Label htmlFor="isFeatured">Show on Home (Featured)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isNewArrival"
            checked={formData.isNewArrival}
            onCheckedChange={(checked) => setFormData({ ...formData, isNewArrival: checked })}
          />
          <Label htmlFor="isNewArrival">Show on New Arrivals</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </DialogFooter>
    </form>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Save,
  X,
} from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

interface SidebarSection {
  id: string
  title: string
  order: number
  isActive: boolean
  items: SidebarItem[]
}

interface SidebarItem {
  id: string
  sectionId: string
  productId: string | null
  label: string
  href: string | null
  image: string | null
  order: number
  isActive: boolean
  product?: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
  }
}

export default function AdminSidebarPage() {
  const [sections, setSections] = useState<SidebarSection[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<SidebarSection | null>(null)
  
  // Form states
  const [sectionTitle, setSectionTitle] = useState("")
  const [sectionOrder, setSectionOrder] = useState(0)
  const [sectionIsActive, setSectionIsActive] = useState(true)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/admin/sidebar")
      if (res.ok) {
        const data = await res.json()
        setSections(data)
      }
    } catch (error) {
      toast.error("Failed to fetch sidebar sections")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSection = () => {
    setEditingSection(null)
    setSectionTitle("")
    setSectionOrder(0)
    setSectionIsActive(true)
    setSectionDialogOpen(true)
  }

  const handleEditSection = (section: SidebarSection) => {
    setEditingSection(section)
    setSectionTitle(section.title)
    setSectionOrder(section.order)
    setSectionIsActive(section.isActive)
    setSectionDialogOpen(true)
  }

  const handleSaveSection = async () => {
    if (!sectionTitle.trim()) {
      toast.error("Title is required")
      return
    }

    try {
      const url = "/api/admin/sidebar"
      const method = editingSection ? "PUT" : "POST"
      const body = editingSection
        ? { id: editingSection.id, title: sectionTitle, order: sectionOrder, isActive: sectionIsActive }
        : { title: sectionTitle, order: sectionOrder }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(`Section ${editingSection ? "updated" : "created"} successfully`)
        setSectionDialogOpen(false)
        fetchSections()
      } else {
        toast.error("Failed to save section")
      }
    } catch (error) {
      toast.error("Failed to save section")
    }
  }

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section? All items in it will also be deleted.")) {
      return
    }

    try {
      const res = await fetch(`/api/admin/sidebar?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Section deleted successfully")
        fetchSections()
      } else {
        toast.error("Failed to delete section")
      }
    } catch (error) {
      toast.error("Failed to delete section")
    }
  }


  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return
    }

    try {
      const res = await fetch(`/api/admin/sidebar/items?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Item deleted successfully")
        fetchSections()
      } else {
        toast.error("Failed to delete item")
      }
    } catch (error) {
      toast.error("Failed to delete item")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sidebar Management</h1>
          <p className="text-muted-foreground">
            Configure sidebar sections and items for the main page
          </p>
        </div>
        <Button onClick={handleCreateSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No sections yet. Create one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>{section.title}</CardTitle>
                    <Badge variant={section.isActive ? "default" : "secondary"}>
                      {section.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">Order: {section.order}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <CardDescription>
                    Products are added to sidebar sections from the Products page. 
                    When creating or editing a product, you can select which sidebar sections to include it in.
                  </CardDescription>
                  {section.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground mt-4">No products in this section yet</p>
                  ) : (
                    <div className="space-y-2 mt-4">
                      <p className="text-sm font-medium mb-2">Products in this section ({section.items.length}):</p>
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          {item.product?.images?.[0] && (
                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                              <Image
                                src={item.product.images[0]}
                                alt={item.label}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.productId
                                ? `Product: ${item.product?.name || "Unknown"}`
                                : `Link: ${item.href || "N/A"}`}
                            </p>
                          </div>
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Section Dialog */}
      <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Section" : "Create Section"}
            </DialogTitle>
            <DialogDescription>
              {editingSection
                ? "Update the section details"
                : "Create a new sidebar section"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="section-title">Title</Label>
              <Input
                id="section-title"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="e.g., Featured Products"
              />
            </div>
            <div>
              <Label htmlFor="section-order">Order</Label>
              <Input
                id="section-order"
                type="number"
                value={sectionOrder}
                onChange={(e) => setSectionOrder(parseInt(e.target.value) || 0)}
              />
            </div>
            {editingSection && (
              <div className="flex items-center justify-between">
                <Label htmlFor="section-active">Active</Label>
                <Switch
                  id="section-active"
                  checked={sectionIsActive}
                  onCheckedChange={setSectionIsActive}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSection}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}


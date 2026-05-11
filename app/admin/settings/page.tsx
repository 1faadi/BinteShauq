"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Store,
  Mail,
  Shield,
  Database,
  Bell,
  Save,
  Type,
  ImageIcon,
  FileText,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  HERO_FONT_FAMILIES,
  HERO_FONT_SIZES_LINE1,
  HERO_FONT_SIZES_LINE2,
  HERO_FONT_WEIGHTS,
} from "@/lib/hero-config"
import toast from "react-hot-toast"

type AdminSettingsForm = {
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  maintenanceMode: boolean
  allowRegistration: boolean
  requireEmailVerification: boolean
  enableNotifications: boolean
  lowStockThreshold: number
  currency: string
  timezone: string
  heroLine1: string
  heroLine2: string
  heroFontFamily1: string
  heroFontFamily2: string
  heroFontSize1: string
  heroFontSize2: string
  heroFontWeight1: string
  heroFontWeight2: string
  heroImageUrl: string
  heroButtonText: string
  heroButtonHref: string
  homeAboutTitle: string
  homeAboutParagraph1: string
  homeAboutParagraph2: string
  homeAboutButtonText: string
  homeAboutButtonHref: string
  homeAboutImageUrl: string
  homeAboutImageAlt: string
}

const DEFAULT_ADMIN_SETTINGS: AdminSettingsForm = {
  storeName: "",
  storeDescription: "",
  storeEmail: "",
  storePhone: "",
  storeAddress: "",
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: false,
  enableNotifications: true,
  lowStockThreshold: 10,
  currency: "PKR",
  timezone: "Asia/Karachi",
  heroLine1: "Premium Women's Wear",
  heroLine2: "Karandi Shawls",
  heroFontFamily1: "geist",
  heroFontFamily2: "georgia",
  heroFontSize1: "6xl",
  heroFontSize2: "3xl",
  heroFontWeight1: "bold",
  heroFontWeight2: "semibold",
  heroImageUrl: "",
  heroButtonText: "Shop Now",
  heroButtonHref: "/shop",
  homeAboutTitle: "About Our Collection",
  homeAboutParagraph1:
    "Our karandi shawls are crafted with the finest materials and traditional techniques, bringing together timeless elegance and modern comfort. Each piece is carefully selected to ensure the highest quality and authentic craftsmanship.",
  homeAboutParagraph2:
    "From the delicate beige tones to the rich midnight colors, our collection offers something for every occasion and personal style preference.",
  homeAboutButtonText: "Explore Collection",
  homeAboutButtonHref: "/collections/blossom",
  homeAboutImageUrl: "",
  homeAboutImageAlt: "Karandi Shawl Detail",
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettingsForm>(DEFAULT_ADMIN_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingHero, setIsUploadingHero] = useState(false)
  const [isUploadingAboutImage, setIsUploadingAboutImage] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: 'no-store' })
        if (!res.ok) return
        const data: unknown = await res.json()
        if (!data || typeof data !== "object") return
        const row = data as Record<string, unknown>
        setSettings((prev) => ({
          ...prev,
          ...row,
          heroImageUrl: typeof row.heroImageUrl === "string" ? row.heroImageUrl : "",
          heroButtonText:
            typeof row.heroButtonText === "string" && row.heroButtonText !== ""
              ? row.heroButtonText
              : prev.heroButtonText,
          heroButtonHref:
            typeof row.heroButtonHref === "string" && row.heroButtonHref !== ""
              ? row.heroButtonHref
              : prev.heroButtonHref,
          homeAboutTitle:
            typeof row.homeAboutTitle === "string" ? row.homeAboutTitle : prev.homeAboutTitle,
          homeAboutParagraph1:
            typeof row.homeAboutParagraph1 === "string"
              ? row.homeAboutParagraph1
              : prev.homeAboutParagraph1,
          homeAboutParagraph2:
            typeof row.homeAboutParagraph2 === "string"
              ? row.homeAboutParagraph2
              : prev.homeAboutParagraph2,
          homeAboutButtonText:
            typeof row.homeAboutButtonText === "string" && row.homeAboutButtonText !== ""
              ? row.homeAboutButtonText
              : prev.homeAboutButtonText,
          homeAboutButtonHref:
            typeof row.homeAboutButtonHref === "string" && row.homeAboutButtonHref !== ""
              ? row.homeAboutButtonHref
              : prev.homeAboutButtonHref,
          homeAboutImageUrl:
            typeof row.homeAboutImageUrl === "string" ? row.homeAboutImageUrl : "",
          homeAboutImageAlt:
            typeof row.homeAboutImageAlt === "string" ? row.homeAboutImageAlt : prev.homeAboutImageAlt,
          lowStockThreshold:
            typeof row.lowStockThreshold === "number" && !Number.isNaN(row.lowStockThreshold)
              ? row.lowStockThreshold
              : prev.lowStockThreshold,
        }))
      } catch {
        // noop
      }
    }
    void load()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        toast.success("Settings saved successfully")
      } else {
        toast.error("Failed to save settings")
      }
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = <K extends keyof AdminSettingsForm>(
    field: K,
    value: AdminSettingsForm[K],
  ): void => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleHeroImageFile = async (fileList: FileList | null): Promise<void> => {
    const file = fileList?.[0]
    if (!file) return
    setIsUploadingHero(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "binteshauq/hero")
      const res = await fetch("/api/upload/cloudinary", { method: "POST", body: fd })
      const payload: unknown = await res.json()
      if (!res.ok) {
        toast.error("Failed to upload hero image")
        return
      }
      if (
        typeof payload === "object" &&
        payload !== null &&
        "url" in payload &&
        typeof (payload as { url: unknown }).url === "string"
      ) {
        handleInputChange("heroImageUrl", (payload as { url: string }).url)
        toast.success("Hero image uploaded")
      }
    } catch {
      toast.error("Failed to upload hero image")
    } finally {
      setIsUploadingHero(false)
    }
  }

  const handleAboutImageFile = async (fileList: FileList | null): Promise<void> => {
    const file = fileList?.[0]
    if (!file) return
    setIsUploadingAboutImage(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "binteshauq/home-about")
      const res = await fetch("/api/upload/cloudinary", { method: "POST", body: fd })
      const payload: unknown = await res.json()
      if (!res.ok) {
        toast.error("Failed to upload section image")
        return
      }
      if (
        typeof payload === "object" &&
        payload !== null &&
        "url" in payload &&
        typeof (payload as { url: unknown }).url === "string"
      ) {
        handleInputChange("homeAboutImageUrl", (payload as { url: string }).url)
        toast.success("About section image uploaded")
      }
    } catch {
      toast.error("Failed to upload section image")
    } finally {
      setIsUploadingAboutImage(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store configuration and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Home Page Hero */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Home Page Hero
            </CardTitle>
            <CardDescription>
              Background image, headline, subheadline, and primary button on the home page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Line 1 (Main Headline)</Label>
                <Input
                  value={settings.heroLine1}
                  onChange={(e) => handleInputChange("heroLine1", e.target.value)}
                  placeholder="e.g. Premium Women's Wear"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Font</Label>
                    <Select
                      value={settings.heroFontFamily1}
                      onValueChange={(v) => handleInputChange("heroFontFamily1", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HERO_FONT_FAMILIES.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Size</Label>
                    <Select
                      value={settings.heroFontSize1}
                      onValueChange={(v) => handleInputChange("heroFontSize1", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HERO_FONT_SIZES_LINE1.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Weight</Label>
                    <Select
                      value={settings.heroFontWeight1}
                      onValueChange={(v) => handleInputChange("heroFontWeight1", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HERO_FONT_WEIGHTS.map((w) => (
                          <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Line 2 (Subheadline)</Label>
                <Input
                  value={settings.heroLine2}
                  onChange={(e) => handleInputChange("heroLine2", e.target.value)}
                  placeholder="e.g. Karandi Shawls"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Font</Label>
                    <Select
                      value={settings.heroFontFamily2}
                      onValueChange={(v) => handleInputChange("heroFontFamily2", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HERO_FONT_FAMILIES.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Size</Label>
                    <Select
                      value={settings.heroFontSize2}
                      onValueChange={(v) => handleInputChange("heroFontSize2", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HERO_FONT_SIZES_LINE2.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Weight</Label>
                    <Select
                      value={settings.heroFontWeight2}
                      onValueChange={(v) => handleInputChange("heroFontWeight2", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HERO_FONT_WEIGHTS.map((w) => (
                          <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <Label className="text-base">Hero background image</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Paste a full image URL (Cloudinary works), or a path under{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">public</code> such as{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">/karandi-shawl-back.jpg</code>.
                Leave blank to use the default image.
              </p>
              <Input
                value={settings.heroImageUrl}
                onChange={(e) => handleInputChange("heroImageUrl", e.target.value)}
                placeholder="/karandi-shawl-back.jpg"
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" disabled={isUploadingHero} asChild>
                  <label className="cursor-pointer">
                    {isUploadingHero ? "Uploading…" : "Upload to Cloudinary"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={isUploadingHero}
                      onChange={(e) => {
                        void handleHeroImageFile(e.target.files)
                        e.target.value = ""
                      }}
                    />
                  </label>
                </Button>
              </div>
              {settings.heroImageUrl !== "" ? (
                <div className="relative mt-2 aspect-[21/9] max-h-52 w-full max-w-3xl overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={settings.heroImageUrl}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Button label</Label>
                  <Input
                    value={settings.heroButtonText}
                    onChange={(e) => handleInputChange("heroButtonText", e.target.value)}
                    placeholder="Shop Now"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button link</Label>
                  <Input
                    value={settings.heroButtonHref}
                    onChange={(e) => handleInputChange("heroButtonHref", e.target.value)}
                    placeholder="/shop"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Home — About collection section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Home — About collection
            </CardTitle>
            <CardDescription>
              Title, copy, button, and image for the “About our collection” block on the home page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="homeAboutTitle">Section title</Label>
              <Input
                id="homeAboutTitle"
                value={settings.homeAboutTitle}
                onChange={(e) => handleInputChange("homeAboutTitle", e.target.value)}
                placeholder="About Our Collection"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeAboutParagraph1">Paragraph 1</Label>
              <Textarea
                id="homeAboutParagraph1"
                value={settings.homeAboutParagraph1}
                onChange={(e) => handleInputChange("homeAboutParagraph1", e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeAboutParagraph2">Paragraph 2</Label>
              <Textarea
                id="homeAboutParagraph2"
                value={settings.homeAboutParagraph2}
                onChange={(e) => handleInputChange("homeAboutParagraph2", e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeAboutButtonText">Button label</Label>
                <Input
                  id="homeAboutButtonText"
                  value={settings.homeAboutButtonText}
                  onChange={(e) => handleInputChange("homeAboutButtonText", e.target.value)}
                  placeholder="Explore Collection"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeAboutButtonHref">Button link</Label>
                <Input
                  id="homeAboutButtonHref"
                  value={settings.homeAboutButtonHref}
                  onChange={(e) => handleInputChange("homeAboutButtonHref", e.target.value)}
                  placeholder="/collections/blossom"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <Label className="text-base">Section image</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                URL or path under{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">public</code>. Leave blank for the default
                image.
              </p>
              <Input
                value={settings.homeAboutImageUrl}
                onChange={(e) => handleInputChange("homeAboutImageUrl", e.target.value)}
                placeholder="/karandi-shawl-detail.png"
              />
              <div className="space-y-2">
                <Label htmlFor="homeAboutImageAlt">Image alt text (accessibility)</Label>
                <Input
                  id="homeAboutImageAlt"
                  value={settings.homeAboutImageAlt}
                  onChange={(e) => handleInputChange("homeAboutImageAlt", e.target.value)}
                  placeholder="Karandi Shawl Detail"
                />
              </div>
              <Button type="button" variant="outline" size="sm" disabled={isUploadingAboutImage} asChild>
                <label className="cursor-pointer">
                  {isUploadingAboutImage ? "Uploading…" : "Upload to Cloudinary"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={isUploadingAboutImage}
                    onChange={(e) => {
                      void handleAboutImageFile(e.target.files)
                      e.target.value = ""
                    }}
                  />
                </label>
              </Button>
              {settings.homeAboutImageUrl !== "" ? (
                <div className="relative mt-2 aspect-[3/2] max-h-56 w-full max-w-xl overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={settings.homeAboutImageUrl}
                    alt="About section preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 640px"
                  />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
            <CardDescription>
              Basic information about your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleInputChange("storeName", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleInputChange("storeEmail", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => handleInputChange("storePhone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="storeAddress">Store Address</Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleInputChange("storeAddress", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Configure system behavior and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the store for maintenance
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowRegistration">Allow User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to create accounts
                </p>
              </div>
              <Switch
                id="allowRegistration"
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => handleInputChange("allowRegistration", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require users to verify their email address
                </p>
              </div>
              <Switch
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => handleInputChange("requireEmailVerification", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for orders and updates
                </p>
              </div>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleInputChange("enableNotifications", checked)}
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => {
                  const n = Number.parseInt(e.target.value, 10)
                  handleInputChange("lowStockThreshold", Number.isNaN(n) ? 10 : n)
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Get notified when product stock falls below this number
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Regional Settings
            </CardTitle>
            <CardDescription>
              Configure currency, timezone, and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage security preferences and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Admin Access</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Admin Panel Access</p>
                  <p className="text-sm text-muted-foreground">
                    Only users with ADMIN role can access the admin panel
                  </p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>API Security</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">API Rate Limiting</p>
                  <p className="text-sm text-muted-foreground">
                    Prevent abuse with rate limiting on API endpoints
                  </p>
                </div>
                <Badge variant="outline">Enabled</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data Protection</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Password Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    All passwords are encrypted using bcrypt
                  </p>
                </div>
                <Badge variant="outline">Secure</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Information
          </CardTitle>
          <CardDescription>
            Database status and maintenance information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium">Database Status</p>
              <Badge className="mt-1">Connected</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Bell className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Last Backup</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium">Security</p>
              <Badge variant="outline" className="mt-1">SSL Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

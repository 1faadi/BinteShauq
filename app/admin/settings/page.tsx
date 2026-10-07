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
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
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
import { MAX_HERO_SLIDES, parseHeroSlides, type HeroSlide } from "@/lib/validators/forms"
import toast from "react-hot-toast"

type AdminSettingsForm = {
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  storeWhatsapp: string
  storeInstagramUrl: string
  announcementEnabled: boolean
  announcementText: string
  announcementLink: string
  codAdvancePkr: number
  codHighOrderThresholdPkr: number
  codHighOrderPercent: number
  exchangeWorkingDays: number
  deliveryEstimateText: string
  maintenanceMode: boolean
  allowRegistration: boolean
  requireEmailVerification: boolean
  enableNotifications: boolean
  lowStockThreshold: number
  deliveryChargeEnabled: boolean
  deliveryChargePkr: number
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
  heroSlides: HeroSlide[]
  homeAboutTitle: string
  homeAboutParagraph1: string
  homeAboutParagraph2: string
  homeAboutButtonText: string
  homeAboutButtonHref: string
  homeAboutImageUrl: string
  homeAboutImageAlt: string
}

const EMPTY_HERO_SLIDE: HeroSlide = {
  imageUrl: "",
  line1: "",
  line2: "",
  buttonText: "Shop New Arrivals",
  buttonHref: "/new-arrivals",
}

const DEFAULT_ADMIN_SETTINGS: AdminSettingsForm = {
  storeName: "",
  storeDescription: "",
  storeEmail: "",
  storePhone: "",
  storeAddress: "",
  storeWhatsapp: "",
  storeInstagramUrl: "https://www.instagram.com/bint_e_shauq/",
  announcementEnabled: false,
  announcementText: "",
  announcementLink: "",
  codAdvancePkr: 1000,
  codHighOrderThresholdPkr: 30000,
  codHighOrderPercent: 50,
  exchangeWorkingDays: 7,
  deliveryEstimateText: "Nationwide delivery in approximately 4–5 working days",
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: false,
  enableNotifications: true,
  lowStockThreshold: 10,
  deliveryChargeEnabled: true,
  deliveryChargePkr: 300,
  currency: "PKR",
  timezone: "Asia/Karachi",
  heroLine1: "Premium Pakistani Women's Clothing",
  heroLine2:
    "Discover thoughtfully designed embroidered suits, kurtas and seasonal collections.",
  heroFontFamily1: "geist",
  heroFontFamily2: "georgia",
  heroFontSize1: "6xl",
  heroFontSize2: "3xl",
  heroFontWeight1: "bold",
  heroFontWeight2: "semibold",
  heroImageUrl: "",
  heroButtonText: "Shop New Arrivals",
  heroButtonHref: "/new-arrivals",
  heroSlides: [
    {
      imageUrl: "",
      line1: "Premium Pakistani Women's Clothing",
      line2:
        "Discover thoughtfully designed embroidered suits, kurtas and seasonal collections.",
      buttonText: "Shop New Arrivals",
      buttonHref: "/new-arrivals",
    },
  ],
  homeAboutTitle: "Stitching Stories of Grace",
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
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null)
  const [isUploadingAboutImage, setIsUploadingAboutImage] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: 'no-store' })
        if (!res.ok) return
        const data: unknown = await res.json()
        if (!data || typeof data !== "object") return
        const row = data as Record<string, unknown>
        const heroImageUrl = typeof row.heroImageUrl === "string" ? row.heroImageUrl : ""
        const heroButtonText =
          typeof row.heroButtonText === "string" && row.heroButtonText !== ""
            ? row.heroButtonText
            : DEFAULT_ADMIN_SETTINGS.heroButtonText
        const heroButtonHref =
          typeof row.heroButtonHref === "string" && row.heroButtonHref !== ""
            ? row.heroButtonHref
            : DEFAULT_ADMIN_SETTINGS.heroButtonHref
        const heroLine1 =
          typeof row.heroLine1 === "string" && row.heroLine1 !== ""
            ? row.heroLine1
            : DEFAULT_ADMIN_SETTINGS.heroLine1
        const heroLine2 =
          typeof row.heroLine2 === "string" && row.heroLine2 !== ""
            ? row.heroLine2
            : DEFAULT_ADMIN_SETTINGS.heroLine2
        const heroSlides = parseHeroSlides(row.heroSlides, {
          heroImageUrl,
          heroLine1,
          heroLine2,
          heroButtonText,
          heroButtonHref,
        })
        setSettings((prev) => ({
          ...prev,
          ...row,
          heroLine1,
          heroLine2,
          heroImageUrl,
          heroButtonText,
          heroButtonHref,
          heroSlides,
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
          deliveryChargeEnabled:
            typeof row.deliveryChargeEnabled === "boolean"
              ? row.deliveryChargeEnabled
              : prev.deliveryChargeEnabled,
          deliveryChargePkr:
            typeof row.deliveryChargePkr === "number" && !Number.isNaN(row.deliveryChargePkr)
              ? Math.max(0, Math.floor(row.deliveryChargePkr))
              : prev.deliveryChargePkr,
          storeWhatsapp:
            typeof row.storeWhatsapp === "string" ? row.storeWhatsapp : prev.storeWhatsapp,
          storeInstagramUrl:
            typeof row.storeInstagramUrl === "string"
              ? row.storeInstagramUrl
              : prev.storeInstagramUrl,
          announcementEnabled: !!row.announcementEnabled,
          announcementText:
            typeof row.announcementText === "string" ? row.announcementText : prev.announcementText,
          announcementLink:
            typeof row.announcementLink === "string" ? row.announcementLink : prev.announcementLink,
          codAdvancePkr:
            typeof row.codAdvancePkr === "number" ? row.codAdvancePkr : prev.codAdvancePkr,
          codHighOrderThresholdPkr:
            typeof row.codHighOrderThresholdPkr === "number"
              ? row.codHighOrderThresholdPkr
              : prev.codHighOrderThresholdPkr,
          codHighOrderPercent:
            typeof row.codHighOrderPercent === "number"
              ? row.codHighOrderPercent
              : prev.codHighOrderPercent,
          exchangeWorkingDays:
            typeof row.exchangeWorkingDays === "number"
              ? row.exchangeWorkingDays
              : prev.exchangeWorkingDays,
          deliveryEstimateText:
            typeof row.deliveryEstimateText === "string"
              ? row.deliveryEstimateText
              : prev.deliveryEstimateText,
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

  const updateHeroSlide = (index: number, patch: Partial<HeroSlide>): void => {
    setSettings((prev) => {
      const heroSlides = prev.heroSlides.map((slide, i) =>
        i === index ? { ...slide, ...patch } : slide,
      )
      const first = heroSlides[0]
      return {
        ...prev,
        heroSlides,
        ...(first
          ? {
              heroImageUrl: first.imageUrl,
              heroLine1: first.line1,
              heroLine2: first.line2,
              heroButtonText: first.buttonText,
              heroButtonHref: first.buttonHref,
            }
          : {}),
      }
    })
  }

  const addHeroSlide = (): void => {
    setSettings((prev) => {
      if (prev.heroSlides.length >= MAX_HERO_SLIDES) return prev
      return { ...prev, heroSlides: [...prev.heroSlides, { ...EMPTY_HERO_SLIDE }] }
    })
  }

  const removeHeroSlide = (index: number): void => {
    setSettings((prev) => {
      if (prev.heroSlides.length <= 1) return prev
      const heroSlides = prev.heroSlides.filter((_, i) => i !== index)
      const first = heroSlides[0]
      return {
        ...prev,
        heroSlides,
        ...(first
          ? {
              heroImageUrl: first.imageUrl,
              heroLine1: first.line1,
              heroLine2: first.line2,
              heroButtonText: first.buttonText,
              heroButtonHref: first.buttonHref,
            }
          : {}),
      }
    })
  }

  const moveHeroSlide = (index: number, direction: -1 | 1): void => {
    setSettings((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.heroSlides.length) return prev
      const heroSlides = [...prev.heroSlides]
      const current = heroSlides[index]
      const swap = heroSlides[target]
      if (!current || !swap) return prev
      heroSlides[index] = swap
      heroSlides[target] = current
      const first = heroSlides[0]
      return {
        ...prev,
        heroSlides,
        ...(first
          ? {
              heroImageUrl: first.imageUrl,
              heroLine1: first.line1,
              heroLine2: first.line2,
              heroButtonText: first.buttonText,
              heroButtonHref: first.buttonHref,
            }
          : {}),
      }
    })
  }

  const handleHeroSlideImageFile = async (
    index: number,
    fileList: FileList | null,
  ): Promise<void> => {
    const file = fileList?.[0]
    if (!file) return
    setUploadingSlideIndex(index)
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
        updateHeroSlide(index, { imageUrl: (payload as { url: string }).url })
        toast.success("Hero image uploaded")
      }
    } catch {
      toast.error("Failed to upload hero image")
    } finally {
      setUploadingSlideIndex(null)
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
              Carousel slides for the home hero — shared typography, then per-slide image and copy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base">Shared typography</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Applies to headline and subheadline on every slide
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Headline (line 1)</Label>
                  <div className="grid grid-cols-3 gap-2">
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
                  <Label className="text-sm">Subheadline (line 2)</Label>
                  <div className="grid grid-cols-3 gap-2">
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
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base">Carousel slides</Label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHeroSlide}
                  disabled={settings.heroSlides.length >= MAX_HERO_SLIDES}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add slide
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Up to {MAX_HERO_SLIDES} slides. Paste a Cloudinary URL or path under{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">public</code>, or upload.
              </p>

              {settings.heroSlides.map((slide, index) => (
                <div key={index} className="rounded-md border p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label className="font-medium">Slide {index + 1}</Label>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => moveHeroSlide(index, -1)}
                        aria-label="Move slide up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index >= settings.heroSlides.length - 1}
                        onClick={() => moveHeroSlide(index, 1)}
                        aria-label="Move slide down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={settings.heroSlides.length <= 1}
                        onClick={() => removeHeroSlide(index)}
                        aria-label="Remove slide"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={slide.imageUrl}
                      onChange={(e) => updateHeroSlide(index, { imageUrl: e.target.value })}
                      placeholder="/karandi-shawl-back.jpg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingSlideIndex === index}
                      asChild
                    >
                      <label className="cursor-pointer">
                        {uploadingSlideIndex === index ? "Uploading…" : "Upload to Cloudinary"}
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          disabled={uploadingSlideIndex === index}
                          onChange={(e) => {
                            void handleHeroSlideImageFile(index, e.target.files)
                            e.target.value = ""
                          }}
                        />
                      </label>
                    </Button>
                    {slide.imageUrl !== "" ? (
                      <div className="relative mt-2 aspect-[21/9] max-h-40 w-full max-w-2xl overflow-hidden rounded-md border bg-muted">
                        <Image
                          src={slide.imageUrl}
                          alt={`Slide ${index + 1} preview`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 640px"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Headline</Label>
                      <Input
                        value={slide.line1}
                        onChange={(e) => updateHeroSlide(index, { line1: e.target.value })}
                        placeholder="e.g. Premium Women's Wear"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subheadline</Label>
                      <Input
                        value={slide.line2}
                        onChange={(e) => updateHeroSlide(index, { line2: e.target.value })}
                        placeholder="e.g. Karandi Shawls"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Button label</Label>
                      <Input
                        value={slide.buttonText}
                        onChange={(e) => updateHeroSlide(index, { buttonText: e.target.value })}
                        placeholder="Shop Now"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Button link</Label>
                      <Input
                        value={slide.buttonHref}
                        onChange={(e) => updateHeroSlide(index, { buttonHref: e.target.value })}
                        placeholder="/shop"
                      />
                    </div>
                  </div>
                </div>
              ))}
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

            <div>
              <Label htmlFor="storeWhatsapp">WhatsApp number</Label>
              <Input
                id="storeWhatsapp"
                value={settings.storeWhatsapp}
                onChange={(e) => handleInputChange("storeWhatsapp", e.target.value)}
                placeholder="923711538953"
              />
            </div>

            <div>
              <Label htmlFor="storeInstagramUrl">Instagram URL</Label>
              <Input
                id="storeInstagramUrl"
                value={settings.storeInstagramUrl}
                onChange={(e) => handleInputChange("storeInstagramUrl", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcement &amp; commerce policy</CardTitle>
            <CardDescription>
              Storefront announcement bar and COD/exchange disclosure amounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="announcementEnabled">Show announcement bar</Label>
              <Switch
                id="announcementEnabled"
                checked={settings.announcementEnabled}
                onCheckedChange={(v) => handleInputChange("announcementEnabled", v)}
              />
            </div>
            <div>
              <Label htmlFor="announcementText">Announcement text</Label>
              <Input
                id="announcementText"
                value={settings.announcementText}
                onChange={(e) => handleInputChange("announcementText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="announcementLink">Announcement link (optional)</Label>
              <Input
                id="announcementLink"
                value={settings.announcementLink}
                onChange={(e) => handleInputChange("announcementLink", e.target.value)}
                placeholder="/shop"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codAdvancePkr">COD advance (PKR)</Label>
                <Input
                  id="codAdvancePkr"
                  type="number"
                  min={0}
                  value={settings.codAdvancePkr}
                  onChange={(e) =>
                    handleInputChange("codAdvancePkr", Math.max(0, Number(e.target.value) || 0))
                  }
                />
              </div>
              <div>
                <Label htmlFor="codHighOrderThresholdPkr">High-order threshold (PKR)</Label>
                <Input
                  id="codHighOrderThresholdPkr"
                  type="number"
                  min={0}
                  value={settings.codHighOrderThresholdPkr}
                  onChange={(e) =>
                    handleInputChange(
                      "codHighOrderThresholdPkr",
                      Math.max(0, Number(e.target.value) || 0)
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="codHighOrderPercent">High-order advance %</Label>
                <Input
                  id="codHighOrderPercent"
                  type="number"
                  min={0}
                  max={100}
                  value={settings.codHighOrderPercent}
                  onChange={(e) =>
                    handleInputChange(
                      "codHighOrderPercent",
                      Math.min(100, Math.max(0, Number(e.target.value) || 0))
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="exchangeWorkingDays">Exchange window (working days)</Label>
                <Input
                  id="exchangeWorkingDays"
                  type="number"
                  min={1}
                  value={settings.exchangeWorkingDays}
                  onChange={(e) =>
                    handleInputChange(
                      "exchangeWorkingDays",
                      Math.max(1, Number(e.target.value) || 1)
                    )
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="deliveryEstimateText">Delivery estimate copy</Label>
              <Input
                id="deliveryEstimateText"
                value={settings.deliveryEstimateText}
                onChange={(e) => handleInputChange("deliveryEstimateText", e.target.value)}
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
                  Hide the storefront and products. Only admin login and dashboard stay available.
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
              Currency and timezone
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

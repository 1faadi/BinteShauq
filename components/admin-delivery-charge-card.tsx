"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Truck } from "lucide-react"

export function AdminDeliveryChargeCard(): React.ReactElement {
  const [enabled, setEnabled] = useState(true)
  const [chargePkr, setChargePkr] = useState(300)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void loadSettings()
  }, [])

  async function loadSettings(): Promise<void> {
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" })
      if (!res.ok) {
        toast.error("Failed to load delivery settings")
        return
      }
      const row: unknown = await res.json()
      if (row === null || typeof row !== "object") return
      const data = row as Record<string, unknown>
      if (typeof data.deliveryChargeEnabled === "boolean") {
        setEnabled(data.deliveryChargeEnabled)
      }
      if (typeof data.deliveryChargePkr === "number" && Number.isFinite(data.deliveryChargePkr)) {
        setChargePkr(Math.max(0, Math.floor(data.deliveryChargePkr)))
      }
    } catch {
      toast.error("Failed to load delivery settings")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(): Promise<void> {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryChargeEnabled: enabled,
          deliveryChargePkr: chargePkr,
        }),
      })
      if (!res.ok) {
        toast.error("Failed to save delivery settings")
        return
      }
      toast.success("Delivery settings saved")
    } catch {
      toast.error("Failed to save delivery settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="h-5 w-5" />
          Delivery charges
        </CardTitle>
        <CardDescription>
          Turn delivery fees on or off and set the standard nationwide rate (PKR)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="productsDeliveryEnabled">Charge delivery fees</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  When off, cart and checkout show free delivery
                </p>
              </div>
              <Switch
                id="productsDeliveryEnabled"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <Label htmlFor="productsDeliveryCharge">Standard charge (PKR)</Label>
                <Input
                  id="productsDeliveryCharge"
                  type="number"
                  min={0}
                  step={1}
                  disabled={!enabled}
                  value={chargePkr}
                  onChange={(e) => {
                    const n = Number.parseInt(e.target.value, 10)
                    setChargePkr(Number.isNaN(n) ? 0 : Math.max(0, n))
                  }}
                  className="mt-1"
                />
              </div>
              <Button onClick={() => void handleSave()} disabled={saving}>
                {saving ? "Saving…" : "Save delivery"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

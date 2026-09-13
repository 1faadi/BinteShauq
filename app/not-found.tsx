import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BRAND_NAME } from "@/lib/site"

export default function NotFound(): React.ReactElement {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-light tracking-tight mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8">
        This page is unavailable. Continue browsing {BRAND_NAME}.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href="/shop">Shop</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  )
}

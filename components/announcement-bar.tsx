import Link from "next/link"
import { getMaintenanceMode } from "@/lib/maintenance"
import { getStoreSettings } from "@/lib/settings"

export async function AnnouncementBar(): Promise<React.ReactElement | null> {
  if (await getMaintenanceMode()) return null

  const settings = await getStoreSettings()
  if (!settings?.announcementEnabled) return null
  const text = settings.announcementText?.trim()
  if (!text) return null
  const href = settings.announcementLink?.trim()

  const inner = (
    <p className="text-center text-xs md:text-sm tracking-wide py-2 px-4">
      {text}
    </p>
  )

  return (
    <div className="bg-primary text-primary-foreground border-b border-primary">
      {href ? (
        <Link href={href} className="block hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  )
}

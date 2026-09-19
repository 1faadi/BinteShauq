import { NextResponse } from "next/server"
import { getMaintenanceMode } from "@/lib/maintenance"

export async function GET(): Promise<NextResponse> {
  const maintenanceMode = await getMaintenanceMode()
  return NextResponse.json(
    { maintenanceMode },
    {
      headers: {
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    }
  )
}

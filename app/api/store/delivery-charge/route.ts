import { NextResponse } from "next/server"
import { getDeliveryChargePkr } from "@/lib/settings"

export async function GET(): Promise<NextResponse<{ deliveryChargePkr: number }>> {
  const deliveryChargePkr = await getDeliveryChargePkr()
  return NextResponse.json({ deliveryChargePkr })
}

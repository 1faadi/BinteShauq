import {
  DEFAULT_COMMERCE_POLICY,
  type CommercePolicy,
} from "@/lib/commerce-policy"
import { getDeliveryChargePkr, getStoreSettings } from "@/lib/settings"

function readNumber(source: object | null, key: string, fallback: number): number {
  if (!source || !(key in source)) return fallback
  const value = (source as Record<string, unknown>)[key]
  return typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : fallback
}

function readString(source: object | null, key: string, fallback: string): string {
  if (!source || !(key in source)) return fallback
  const value = (source as Record<string, unknown>)[key]
  return typeof value === "string" && value.trim() !== "" ? value : fallback
}

export async function getCommercePolicy(): Promise<CommercePolicy> {
  const [deliveryChargePkr, settings] = await Promise.all([
    getDeliveryChargePkr(),
    getStoreSettings(),
  ])
  return {
    ...DEFAULT_COMMERCE_POLICY,
    deliveryChargePkr,
    codAdvancePkr: readNumber(
      settings,
      "codAdvancePkr",
      DEFAULT_COMMERCE_POLICY.codAdvancePkr
    ),
    codHighOrderThresholdPkr: readNumber(
      settings,
      "codHighOrderThresholdPkr",
      DEFAULT_COMMERCE_POLICY.codHighOrderThresholdPkr
    ),
    codHighOrderPercent: readNumber(
      settings,
      "codHighOrderPercent",
      DEFAULT_COMMERCE_POLICY.codHighOrderPercent
    ),
    exchangeWorkingDays: readNumber(
      settings,
      "exchangeWorkingDays",
      DEFAULT_COMMERCE_POLICY.exchangeWorkingDays
    ),
    deliveryEstimateText: readString(
      settings,
      "deliveryEstimateText",
      DEFAULT_COMMERCE_POLICY.deliveryEstimateText
    ),
  }
}

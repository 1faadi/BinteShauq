export type CommercePolicy = {
  deliveryChargePkr: number
  deliveryEstimateText: string
  codAdvancePkr: number
  codHighOrderThresholdPkr: number
  codHighOrderPercent: number
  exchangeWorkingDays: number
}

export const DEFAULT_COMMERCE_POLICY: CommercePolicy = {
  deliveryChargePkr: 300,
  deliveryEstimateText: "Nationwide delivery in approximately 4–5 working days",
  codAdvancePkr: 1000,
  codHighOrderThresholdPkr: 30000,
  codHighOrderPercent: 50,
  exchangeWorkingDays: 7,
}

export function formatCodAdvanceCopy(policy: CommercePolicy): string {
  return `Cash on Delivery requires an advance of Rs. ${policy.codAdvancePkr.toLocaleString()}. Orders above Rs. ${policy.codHighOrderThresholdPkr.toLocaleString()} require at least ${policy.codHighOrderPercent}% advance before dispatch.`
}

export function formatExchangeCopy(policy: CommercePolicy): string {
  return `Exchange requests are accepted within ${policy.exchangeWorkingDays} working days of delivery. Refunds are not offered.`
}

export function requiredCodAdvance(
  orderTotal: number,
  policy: CommercePolicy
): number {
  if (orderTotal > policy.codHighOrderThresholdPkr) {
    return Math.ceil((orderTotal * policy.codHighOrderPercent) / 100)
  }
  return policy.codAdvancePkr
}

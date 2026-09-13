import Link from "next/link"
import {
  formatCodAdvanceCopy,
  formatExchangeCopy,
  type CommercePolicy,
} from "@/lib/commerce-policy"

export function PurchasePolicyNotice({
  policy,
  className,
}: {
  policy: CommercePolicy
  className?: string
}): React.ReactElement {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {policy.deliveryEstimateText}.{" "}
        {policy.deliveryChargePkr > 0
          ? `Delivery charge: Rs. ${policy.deliveryChargePkr.toLocaleString()}.`
          : "Delivery is free."}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
        {formatCodAdvanceCopy(policy)}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
        {formatExchangeCopy(policy)}{" "}
        <Link href="/policies" className="underline underline-offset-2 hover:text-foreground">
          Full policies
        </Link>
      </p>
    </div>
  )
}

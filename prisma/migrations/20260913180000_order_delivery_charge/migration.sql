-- AlterTable
ALTER TABLE "Order" ADD COLUMN "deliveryChargePkr" INTEGER NOT NULL DEFAULT 0;

-- Backfill: infer fee from total minus line items (clamped at 0)
UPDATE "Order" o
SET "deliveryChargePkr" = GREATEST(
  0,
  o.total - COALESCE(
    (
      SELECT SUM(oi.price * oi.quantity)
      FROM "OrderItem" oi
      WHERE oi."orderId" = o.id
    ),
    0
  )
);

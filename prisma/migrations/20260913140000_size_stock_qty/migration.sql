-- Per-size inventory quantities
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sizeSStock" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sizeMStock" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sizeLStock" INTEGER NOT NULL DEFAULT 0;

-- Preserve availability for existing products that were not sold out
UPDATE "Product"
SET "sizeSStock" = CASE WHEN "sizeSSoldOut" THEN 0 ELSE 100 END,
    "sizeMStock" = CASE WHEN "sizeMSoldOut" THEN 0 ELSE 100 END,
    "sizeLStock" = CASE WHEN "sizeLSoldOut" THEN 0 ELSE 100 END;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "detailsCustom" TEXT;
ALTER TABLE "Product" ADD COLUMN "dupattaShawlKind" TEXT;
ALTER TABLE "Product" ADD COLUMN "dupattaShawlDetail" TEXT;
ALTER TABLE "Product" ADD COLUMN "trousers" TEXT;
ALTER TABLE "Product" ADD COLUMN "embellishment" TEXT;

-- Backfill from legacy columns where new fields are empty
UPDATE "Product" SET "embellishment" = "embroidery" WHERE "embellishment" IS NULL AND "embroidery" IS NOT NULL;
UPDATE "Product" SET "trousers" = "suitFabric" WHERE "trousers" IS NULL AND "suitFabric" IS NOT NULL;
UPDATE "Product" SET "dupattaShawlDetail" = COALESCE("shawlLength", "usage") WHERE "dupattaShawlDetail" IS NULL AND (COALESCE("shawlLength", "usage") IS NOT NULL);
UPDATE "Product" SET "dupattaShawlKind" = 'shawl' WHERE "dupattaShawlKind" IS NULL AND ("shawlLength" IS NOT NULL OR "usage" ILIKE '%shawl%');
UPDATE "Product" SET "dupattaShawlKind" = 'dupatta' WHERE "dupattaShawlKind" IS NULL AND "usage" ILIKE '%dupatta%';

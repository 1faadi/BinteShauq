-- Guest cart
ALTER TABLE "CartItem" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "CartItem" ADD COLUMN IF NOT EXISTS "guestId" TEXT;
DROP INDEX IF EXISTS "CartItem_userId_productId_size_key";
CREATE INDEX IF NOT EXISTS "CartItem_userId_idx" ON "CartItem"("userId");
CREATE INDEX IF NOT EXISTS "CartItem_guestId_idx" ON "CartItem"("guestId");
CREATE INDEX IF NOT EXISTS "CartItem_userId_productId_size_idx" ON "CartItem"("userId", "productId", "size");
CREATE INDEX IF NOT EXISTS "CartItem_guestId_productId_size_idx" ON "CartItem"("guestId", "productId", "size");

-- Guest orders + idempotency + size on line items
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "guestEmail" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Order_idempotencyKey_key" ON "Order"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "Order_guestEmail_idx" ON "Order"("guestEmail");

ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "size" TEXT;

-- Store settings extensions
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "storeWhatsapp" TEXT;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "storeInstagramUrl" TEXT;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "announcementEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "announcementText" TEXT;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "announcementLink" TEXT;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "codAdvancePkr" INTEGER NOT NULL DEFAULT 1000;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "codHighOrderThresholdPkr" INTEGER NOT NULL DEFAULT 30000;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "codHighOrderPercent" INTEGER NOT NULL DEFAULT 50;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "exchangeWorkingDays" INTEGER NOT NULL DEFAULT 7;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "deliveryEstimateText" TEXT DEFAULT 'Nationwide delivery in approximately 4–5 working days';

CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "orderNumber" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProductReview" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "authorName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ProductReview_productId_isApproved_idx" ON "ProductReview"("productId", "isApproved");

DO $$ BEGIN
  ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

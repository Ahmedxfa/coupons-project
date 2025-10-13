-- CreateEnum
CREATE TYPE "DealType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BOGO', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "extensionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT,
    "type" "DealType" NOT NULL DEFAULT 'OTHER',
    "discountPercentage" INTEGER,
    "discountAmount" DECIMAL(10,2),
    "expirationDate" TIMESTAMP(3),
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "storeId" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "autoApplicable" BOOLEAN NOT NULL DEFAULT false,
    "extensionPriority" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_stores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_deals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_deals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_featured_idx" ON "categories"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_categoryId_idx" ON "stores"("categoryId");

-- CreateIndex
CREATE INDEX "stores_slug_idx" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_featured_idx" ON "stores"("featured");

-- CreateIndex
CREATE INDEX "deals_storeId_idx" ON "deals"("storeId");

-- CreateIndex
CREATE INDEX "deals_isExpired_idx" ON "deals"("isExpired");

-- CreateIndex
CREATE INDEX "deals_featured_idx" ON "deals"("featured");

-- CreateIndex
CREATE INDEX "deals_expirationDate_idx" ON "deals"("expirationDate");

-- CreateIndex
CREATE INDEX "favorite_stores_userId_idx" ON "favorite_stores"("userId");

-- CreateIndex
CREATE INDEX "favorite_stores_storeId_idx" ON "favorite_stores"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_stores_userId_storeId_key" ON "favorite_stores"("userId", "storeId");

-- CreateIndex
CREATE INDEX "favorite_deals_userId_idx" ON "favorite_deals"("userId");

-- CreateIndex
CREATE INDEX "favorite_deals_dealId_idx" ON "favorite_deals"("dealId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_deals_userId_dealId_key" ON "favorite_deals"("userId", "dealId");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_stores" ADD CONSTRAINT "favorite_stores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_stores" ADD CONSTRAINT "favorite_stores_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_deals" ADD CONSTRAINT "favorite_deals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_deals" ADD CONSTRAINT "favorite_deals_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

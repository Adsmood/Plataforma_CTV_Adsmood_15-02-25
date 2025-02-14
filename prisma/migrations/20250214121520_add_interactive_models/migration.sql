-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "position" JSONB NOT NULL,
    "size" JSONB NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "overlays" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "position" JSONB NOT NULL,
    "size" JSONB NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION,
    "zIndex" INTEGER NOT NULL DEFAULT 0,
    "styles" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "overlays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interactions_adId_idx" ON "interactions"("adId");

-- CreateIndex
CREATE INDEX "interactions_type_idx" ON "interactions"("type");

-- CreateIndex
CREATE INDEX "overlays_adId_idx" ON "overlays"("adId");

-- CreateIndex
CREATE INDEX "overlays_type_idx" ON "overlays"("type");

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overlays" ADD CONSTRAINT "overlays_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

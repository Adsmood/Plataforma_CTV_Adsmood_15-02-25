-- CreateTable
CREATE TABLE "ads" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "interactiveData" JSONB,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "codec" TEXT NOT NULL,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_metrics" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "starts" INTEGER NOT NULL DEFAULT 0,
    "firstQuartiles" INTEGER NOT NULL DEFAULT 0,
    "midpoints" INTEGER NOT NULL DEFAULT 0,
    "thirdQuartiles" INTEGER NOT NULL DEFAULT 0,
    "completes" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "mutes" INTEGER NOT NULL DEFAULT 0,
    "unmutes" INTEGER NOT NULL DEFAULT 0,
    "pauses" INTEGER NOT NULL DEFAULT 0,
    "resumes" INTEGER NOT NULL DEFAULT 0,
    "fullscreen" INTEGER NOT NULL DEFAULT 0,
    "exitFullscreen" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ads_createdAt_idx" ON "ads"("createdAt");

-- CreateIndex
CREATE INDEX "media_files_adId_idx" ON "media_files"("adId");

-- CreateIndex
CREATE INDEX "media_files_platform_idx" ON "media_files"("platform");

-- CreateIndex
CREATE INDEX "tracking_events_adId_idx" ON "tracking_events"("adId");

-- CreateIndex
CREATE INDEX "tracking_events_type_idx" ON "tracking_events"("type");

-- CreateIndex
CREATE INDEX "tracking_events_timestamp_idx" ON "tracking_events"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ad_metrics_adId_key" ON "ad_metrics"("adId");

-- CreateIndex
CREATE INDEX "ad_metrics_createdAt_idx" ON "ad_metrics"("createdAt");

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_metrics" ADD CONSTRAINT "ad_metrics_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

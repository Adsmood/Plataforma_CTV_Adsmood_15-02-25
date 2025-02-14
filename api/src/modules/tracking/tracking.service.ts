import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(type: string, adId: string, metadata: any) {
    // Registrar el evento
    await this.prisma.trackingEvent.create({
      data: {
        type,
        adId,
        timestamp: new Date(),
        metadata,
      },
    });

    // Actualizar métricas
    await this.updateMetrics(type, adId);
  }

  private async updateMetrics(type: string, adId: string) {
    const metrics = await this.prisma.adMetrics.findUnique({
      where: { adId },
    });

    const update: any = {};

    switch (type) {
      case 'impression':
        update.impressions = (metrics?.impressions || 0) + 1;
        break;
      case 'start':
        update.starts = (metrics?.starts || 0) + 1;
        break;
      case 'firstQuartile':
        update.firstQuartiles = (metrics?.firstQuartiles || 0) + 1;
        break;
      case 'midpoint':
        update.midpoints = (metrics?.midpoints || 0) + 1;
        break;
      case 'thirdQuartile':
        update.thirdQuartiles = (metrics?.thirdQuartiles || 0) + 1;
        break;
      case 'complete':
        update.completes = (metrics?.completes || 0) + 1;
        break;
      case 'click':
        update.clicks = (metrics?.clicks || 0) + 1;
        break;
      case 'mute':
        update.mutes = (metrics?.mutes || 0) + 1;
        break;
      case 'unmute':
        update.unmutes = (metrics?.unmutes || 0) + 1;
        break;
      case 'pause':
        update.pauses = (metrics?.pauses || 0) + 1;
        break;
      case 'resume':
        update.resumes = (metrics?.resumes || 0) + 1;
        break;
      case 'fullscreen':
        update.fullscreen = (metrics?.fullscreen || 0) + 1;
        break;
      case 'exitFullscreen':
        update.exitFullscreen = (metrics?.exitFullscreen || 0) + 1;
        break;
    }

    if (Object.keys(update).length > 0) {
      await this.prisma.adMetrics.upsert({
        where: { adId },
        create: {
          adId,
          ...update,
        },
        update,
      });
    }
  }

  async getMetrics(adId: string) {
    return this.prisma.adMetrics.findUnique({
      where: { adId },
    });
  }

  async getEvents(adId: string, type?: string) {
    return this.prisma.trackingEvent.findMany({
      where: {
        adId,
        ...(type ? { type } : {}),
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
} 
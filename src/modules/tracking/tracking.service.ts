import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async trackEvent(event: string, adId: string, data: Record<string, any>) {
    // Registrar el evento en la base de datos
    const trackingEvent = await this.prisma.trackingEvent.create({
      data: {
        type: event,
        adId,
        userAgent: data.userAgent,
        ipAddress: data.ip,
        timestamp: data.timestamp,
        metadata: data,
      },
    });

    // Actualizar métricas agregadas
    await this.updateMetrics(adId, event);

    return trackingEvent;
  }

  private async updateMetrics(adId: string, event: string) {
    const metrics = await this.prisma.adMetrics.upsert({
      where: { adId },
      create: {
        adId,
        [event]: 1,
      },
      update: {
        [event]: {
          increment: 1,
        },
      },
    });

    return metrics;
  }

  async getMetrics(adId: string) {
    return this.prisma.adMetrics.findUnique({
      where: { adId },
    });
  }
} 
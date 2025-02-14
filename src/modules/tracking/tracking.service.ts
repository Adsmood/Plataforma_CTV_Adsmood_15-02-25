import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Interval } from '@nestjs/schedule';

interface TrackingEvent {
  type: string;
  adId: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

@Injectable()
export class TrackingService implements OnModuleInit, OnModuleDestroy {
  private eventQueue: TrackingEvent[] = [];
  private readonly batchSize: number;
  private readonly flushInterval: number;
  private flushTimeout: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.batchSize = this.config.get('TRACKING_BATCH_SIZE', 100);
    this.flushInterval = this.config.get('TRACKING_FLUSH_INTERVAL', 60000);
  }

  async onModuleInit() {
    // Iniciar el intervalo de flush
    this.scheduleFlush();
  }

  async onModuleDestroy() {
    // Asegurarse de procesar eventos pendientes antes de cerrar
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }
    await this.flushEvents();
  }

  private scheduleFlush() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }
    this.flushTimeout = setTimeout(() => this.flushEvents(), this.flushInterval);
  }

  @Interval(60000) // Ejecutar cada minuto
  private async flushEvents() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Procesar eventos en lotes
      for (let i = 0; i < events.length; i += this.batchSize) {
        const batch = events.slice(i, i + this.batchSize);
        await this.processBatch(batch);
      }
    } catch (error) {
      console.error('Error al procesar eventos:', error);
      // Reintentar eventos fallidos
      this.eventQueue.push(...events);
    }
  }

  private async processBatch(events: TrackingEvent[]) {
    await this.prisma.$transaction(async (tx) => {
      // Crear eventos
      await tx.trackingEvent.createMany({
        data: events.map(event => ({
          type: event.type,
          adId: event.adId,
          userAgent: event.userAgent,
          ipAddress: event.ipAddress,
          timestamp: event.timestamp,
          metadata: event.metadata,
        })),
      });

      // Actualizar métricas agregadas
      const metricUpdates = events.reduce((acc, event) => {
        const key = `${event.adId}-${event.type}`;
        if (!acc[key]) {
          acc[key] = {
            adId: event.adId,
            type: event.type,
            count: 0,
          };
        }
        acc[key].count++;
        return acc;
      }, {} as Record<string, { adId: string; type: string; count: number }>);

      // Aplicar actualizaciones de métricas
      for (const update of Object.values(metricUpdates)) {
        await tx.adMetrics.upsert({
          where: { adId: update.adId },
          create: {
            adId: update.adId,
            [update.type]: update.count,
          },
          update: {
            [update.type]: {
              increment: update.count,
            },
          },
        });
      }
    });
  }

  async trackEvent(event: string, adId: string, data: Record<string, any>) {
    const trackingEvent: TrackingEvent = {
      type: event,
      adId,
      userAgent: data.userAgent,
      ipAddress: data.ip,
      timestamp: data.timestamp || new Date(),
      metadata: data,
    };

    this.eventQueue.push(trackingEvent);

    // Si alcanzamos el tamaño del lote, procesar inmediatamente
    if (this.eventQueue.length >= this.batchSize) {
      await this.flushEvents();
    } else {
      // Programar el próximo flush
      this.scheduleFlush();
    }

    return { success: true, queued: this.eventQueue.length };
  }

  async getMetrics(adId: string) {
    const [metrics, events] = await Promise.all([
      this.prisma.adMetrics.findUnique({
        where: { adId },
      }),
      this.prisma.trackingEvent.findMany({
        where: { 
          adId,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 1000,
      }),
    ]);

    return {
      metrics,
      recentEvents: events,
      queuedEvents: this.eventQueue.filter(e => e.adId === adId).length,
    };
  }

  async getAggregatedMetrics(period: 'hour' | 'day' | 'week' | 'month' = 'day') {
    const startDate = new Date();
    switch (period) {
      case 'hour':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    const events = await this.prisma.trackingEvent.groupBy({
      by: ['type', 'adId'],
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      _count: true,
    });

    return events;
  }
} 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event } from './entities/event.entity';
import { AdStats } from './entities/ad-stats.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(AdStats)
    private readonly adStatsRepository: Repository<AdStats>,
  ) {}

  async recordEvent(eventData: any): Promise<void> {
    // Crear el evento
    const event = this.eventRepository.create({
      ...eventData,
      timestamp: new Date(eventData.timestamp),
    });
    await this.eventRepository.save(event);

    // Actualizar estadísticas
    await this.updateStats(eventData.adId, eventData.event, eventData.platform);
  }

  async getAdStats(adId: string): Promise<AdStats> {
    const stats = await this.adStatsRepository.findOne({
      where: { adId },
    });

    return stats || this.createEmptyStats(adId);
  }

  async getAdEvents(
    adId: string,
    dateRange?: { startDate?: Date; endDate?: Date },
  ): Promise<Event[]> {
    const where: any = { adId };

    if (dateRange?.startDate || dateRange?.endDate) {
      where.timestamp = Between(
        dateRange.startDate || new Date(0),
        dateRange.endDate || new Date(),
      );
    }

    return this.eventRepository.find({
      where,
      order: { timestamp: 'DESC' },
    });
  }

  private async updateStats(
    adId: string,
    event: string,
    platform: string = 'unknown',
  ): Promise<void> {
    let stats = await this.adStatsRepository.findOne({
      where: { adId },
    });

    if (!stats) {
      stats = this.createEmptyStats(adId);
    }

    // Actualizar contadores globales
    switch (event) {
      case 'impression':
        stats.impressions++;
        break;
      case 'start':
        stats.starts++;
        break;
      case 'firstQuartile':
        stats.firstQuartiles++;
        break;
      case 'midpoint':
        stats.midpoints++;
        break;
      case 'thirdQuartile':
        stats.thirdQuartiles++;
        break;
      case 'complete':
        stats.completes++;
        break;
      case 'click':
        stats.clicks++;
        break;
      case 'error':
        stats.errors++;
        break;
    }

    // Actualizar estadísticas por plataforma
    if (!stats.platformStats[platform]) {
      stats.platformStats[platform] = {
        impressions: 0,
        starts: 0,
        firstQuartiles: 0,
        midpoints: 0,
        thirdQuartiles: 0,
        completes: 0,
        clicks: 0,
        errors: 0,
      };
    }

    // Actualizar contador específico de la plataforma
    switch (event) {
      case 'impression':
        stats.platformStats[platform].impressions++;
        break;
      case 'start':
        stats.platformStats[platform].starts++;
        break;
      case 'firstQuartile':
        stats.platformStats[platform].firstQuartiles++;
        break;
      case 'midpoint':
        stats.platformStats[platform].midpoints++;
        break;
      case 'thirdQuartile':
        stats.platformStats[platform].thirdQuartiles++;
        break;
      case 'complete':
        stats.platformStats[platform].completes++;
        break;
      case 'click':
        stats.platformStats[platform].clicks++;
        break;
      case 'error':
        stats.platformStats[platform].errors++;
        break;
    }

    await this.adStatsRepository.save(stats);
  }

  private createEmptyStats(adId: string): AdStats {
    return this.adStatsRepository.create({
      adId,
      impressions: 0,
      starts: 0,
      firstQuartiles: 0,
      midpoints: 0,
      thirdQuartiles: 0,
      completes: 0,
      clicks: 0,
      errors: 0,
      platformStats: {},
    });
  }
} 
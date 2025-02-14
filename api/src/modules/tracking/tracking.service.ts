import { Injectable } from '@nestjs/common';
import { AnalyticsService } from '../analytics/analytics.service';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class TrackingService {
  constructor(private readonly analyticsService: AnalyticsService) {}

  async trackEvent(
    event: string,
    id: string,
    data: TrackEventDto,
    platform?: string,
  ): Promise<void> {
    const eventData = {
      ...data,
      event,
      adId: id,
      platform: platform || 'unknown',
      timestamp: data.timestamp || Date.now(),
    };

    // Registrar el evento en analytics
    await this.analyticsService.recordEvent(eventData);
  }

  async getStats(id: string): Promise<any> {
    return this.analyticsService.getAdStats(id);
  }

  async getEvents(
    id: string,
    startDate?: string,
    endDate?: string,
  ): Promise<any> {
    return this.analyticsService.getAdEvents(id, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  private validateEvent(event: string): boolean {
    const validEvents = [
      'impression',
      'start',
      'firstQuartile',
      'midpoint',
      'thirdQuartile',
      'complete',
      'click',
      'pause',
      'resume',
      'mute',
      'unmute',
      'fullscreen',
      'exitFullscreen',
      'skip',
      'progress',
      'error',
    ];

    return validEvents.includes(event);
  }
} 
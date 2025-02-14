import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('track')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post(':type/:adId')
  async trackEvent(
    @Param('type') type: string,
    @Param('adId') adId: string,
    @Body() metadata: any,
  ) {
    await this.trackingService.trackEvent(type, adId, metadata);
    return { success: true };
  }

  @Get('metrics/:adId')
  getMetrics(@Param('adId') adId: string) {
    return this.trackingService.getMetrics(adId);
  }

  @Get('events/:adId')
  getEvents(
    @Param('adId') adId: string,
    @Query('type') type?: string,
  ) {
    return this.trackingService.getEvents(adId, type);
  }
} 
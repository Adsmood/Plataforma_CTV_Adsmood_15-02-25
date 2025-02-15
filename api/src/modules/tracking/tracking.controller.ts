import { Controller, Post, Get, Param, Body, Query, Headers, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { TrackEventDto } from './dto/track-event.dto';

@ApiTags('Tracking')
@Controller('track')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('impression/:id')
  @ApiOperation({ summary: 'Registrar una impresión de anuncio' })
  @ApiResponse({ status: 200, description: 'Impresión registrada exitosamente' })
  async trackImpression(
    @Param('id') id: string,
    @Query('platform') platform: string,
    @Query('ts') timestamp: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.trackingService.trackImpression(id, {
      platform,
      timestamp: parseInt(timestamp) || Date.now(),
      userAgent,
      ip
    });
  }

  @Get(':event/:id')
  @ApiOperation({ summary: 'Registrar un evento de video' })
  @ApiResponse({ status: 200, description: 'Evento registrado exitosamente' })
  async trackEvent(
    @Param('event') event: string,
    @Param('id') id: string,
    @Query('platform') platform: string,
    @Query('ts') timestamp: string,
    @Query('progress') progress?: string,
    @Headers('user-agent') userAgent?: string,
    @Ip() ip?: string
  ) {
    return this.trackingService.trackEvent(id, {
      event,
      platform,
      timestamp: parseInt(timestamp) || Date.now(),
      progress: progress ? parseInt(progress) : undefined,
      userAgent,
      ip
    });
  }

  @Post('interaction/:id')
  @ApiOperation({ summary: 'Registrar una interacción del usuario' })
  @ApiResponse({ status: 200, description: 'Interacción registrada exitosamente' })
  async trackInteraction(
    @Param('id') id: string,
    @Query('type') type: string,
    @Query('platform') platform: string,
    @Query('ts') timestamp: string,
    @Query('data') data?: string,
    @Headers('user-agent') userAgent?: string,
    @Ip() ip?: string
  ) {
    return this.trackingService.trackInteraction(id, {
      type,
      platform,
      timestamp: parseInt(timestamp) || Date.now(),
      data: data ? JSON.parse(data) : undefined,
      userAgent,
      ip
    });
  }

  @Get('stats/:id')
  @ApiOperation({ summary: 'Obtener estadísticas de un anuncio' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getStats(
    @Param('id') id: string,
  ): Promise<any> {
    return this.trackingService.getStats(id);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Obtener eventos de un anuncio' })
  @ApiResponse({ status: 200, description: 'Eventos obtenidos exitosamente' })
  async getEvents(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.trackingService.getEvents(id, startDate, endDate);
  }
} 
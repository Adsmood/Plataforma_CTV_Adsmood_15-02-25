import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { TrackEventDto } from './dto/track-event.dto';

@ApiTags('Tracking')
@Controller('track')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post(':event/:id')
  @ApiOperation({ summary: 'Registrar un evento de tracking' })
  @ApiResponse({ status: 201, description: 'Evento registrado exitosamente' })
  async trackEvent(
    @Param('event') event: string,
    @Param('id') id: string,
    @Body() data: TrackEventDto,
    @Query('platform') platform?: string,
  ): Promise<void> {
    return this.trackingService.trackEvent(event, id, data, platform);
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
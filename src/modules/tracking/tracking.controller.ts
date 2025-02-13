import { Controller, Get, Post, Param, Query, Headers, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';

@ApiTags('Tracking')
@Controller('track')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':event/:id')
  @ApiOperation({ summary: 'Registrar evento de tracking' })
  @ApiParam({ name: 'event', description: 'Tipo de evento (impression, start, complete, etc.)' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ name: 'cb', required: false, description: 'Cache buster' })
  @ApiQuery({ name: 'ts', required: false, description: 'Timestamp' })
  async trackEvent(
    @Param('event') event: string,
    @Param('id') id: string,
    @Query() query: Record<string, string>,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    return this.trackingService.trackEvent(event, id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Post('interactive/:id')
  @ApiOperation({ summary: 'Registrar evento de interactividad' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  async trackInteractiveEvent(
    @Param('id') id: string,
    @Query('type') type: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    return this.trackingService.trackEvent('interactive', id, {
      type,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }
} 
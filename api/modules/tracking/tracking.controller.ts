import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
  Headers, 
  Ip, 
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { 
  ApiTags, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { TrackEventDto, TrackingQueryDto } from './dto/tracking.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Tracking')
@Controller('track')
@UseInterceptors(CacheInterceptor)
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly config: ConfigService,
  ) {}

  @Get('impression/:id')
  @ApiOperation({ summary: 'Registrar impresión de anuncio' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @ApiHeader({ name: 'User-Agent', required: false })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackImpression(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('impression', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('start/:id')
  @ApiOperation({ summary: 'Registrar inicio de reproducción' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackStart(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('start', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('firstQuartile/:id')
  @ApiOperation({ summary: 'Registrar primer cuartil de reproducción' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackFirstQuartile(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('firstQuartile', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('midpoint/:id')
  @ApiOperation({ summary: 'Registrar punto medio de reproducción' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackMidpoint(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('midpoint', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('thirdQuartile/:id')
  @ApiOperation({ summary: 'Registrar tercer cuartil de reproducción' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackThirdQuartile(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('thirdQuartile', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('complete/:id')
  @ApiOperation({ summary: 'Registrar finalización de reproducción' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackComplete(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('complete', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('click/:id')
  @ApiOperation({ summary: 'Registrar clic en anuncio' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackClick(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('click', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('mute/:id')
  @ApiOperation({ summary: 'Registrar silenciamiento de anuncio' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackMute(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('mute', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('unmute/:id')
  @ApiOperation({ summary: 'Registrar activación de sonido de anuncio' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackUnmute(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('unmute', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('pause/:id')
  @ApiOperation({ summary: 'Registrar pausa de anuncio' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackPause(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('pause', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('resume/:id')
  @ApiOperation({ summary: 'Registrar reanudación de anuncio' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackResume(
    @Param('id') id: string,
    @Query() query: TrackingQueryDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('resume', id, {
      ...query,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Post('interactive/:id')
  @ApiOperation({ summary: 'Registrar evento de interactividad' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ type: TrackingQueryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackInteractiveEvent(
    @Param('id') id: string,
    @Body() event: TrackEventDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    await this.trackingService.trackEvent('interactive', id, {
      ...event,
      userAgent,
      ip,
      timestamp: new Date(),
    });
  }

  @Get('metrics/:id')
  @ApiOperation({ summary: 'Obtener métricas de un anuncio' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiResponse({ 
    status: 200, 
    description: 'Métricas del anuncio',
  })
  async getMetrics(@Param('id') id: string) {
    return this.trackingService.getMetrics(id);
  }

  @Get('metrics/aggregated')
  @ApiOperation({ summary: 'Obtener métricas agregadas' })
  @ApiQuery({ 
    name: 'period', 
    enum: ['hour', 'day', 'week', 'month'],
    required: false,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Métricas agregadas',
  })
  async getAggregatedMetrics(@Query('period') period?: 'hour' | 'day' | 'week' | 'month') {
    return this.trackingService.getAggregatedMetrics(period);
  }
} 
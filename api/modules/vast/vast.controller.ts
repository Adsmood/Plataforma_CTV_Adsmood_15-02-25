import { Controller, Get, Param, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VastService } from './vast.service';

@ApiTags('VAST')
@Controller('vast')
export class VastController {
  constructor(private readonly vastService: VastService) {}

  @Get(':id')
  @Header('Content-Type', 'application/xml')
  @ApiOperation({ summary: 'Generar VAST XML dinámicamente' })
  @ApiParam({ name: 'id', description: 'ID del anuncio' })
  @ApiQuery({ name: 'platform', required: false, description: 'Plataforma específica (roku, fire_tv, etc.)' })
  async generateVast(
    @Param('id') id: string,
    @Query('platform') platform?: string,
  ): Promise<string> {
    return this.vastService.generateVast(id, platform);
  }
} 
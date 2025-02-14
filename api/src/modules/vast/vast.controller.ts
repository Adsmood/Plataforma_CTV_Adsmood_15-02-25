import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VastService } from './vast.service';
import { GenerateVastDto } from './dto/generate-vast.dto';

@ApiTags('VAST')
@Controller('vast')
export class VastController {
  constructor(private readonly vastService: VastService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Generar VAST XML para un anuncio específico' })
  @ApiResponse({ status: 200, description: 'VAST XML generado exitosamente' })
  @ApiResponse({ status: 404, description: 'Anuncio no encontrado' })
  async generateVast(
    @Param('id') id: string,
    @Query() query: GenerateVastDto,
  ): Promise<string> {
    return this.vastService.generateVast(id, query);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Previsualizar VAST XML' })
  @ApiResponse({ status: 200, description: 'VAST XML generado para previsualización' })
  async previewVast(
    @Param('id') id: string,
    @Query() query: GenerateVastDto,
  ): Promise<string> {
    return this.vastService.previewVast(id, query);
  }
} 
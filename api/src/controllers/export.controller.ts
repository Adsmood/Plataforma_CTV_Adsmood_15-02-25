import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ConversionQueueService } from '../services/conversion-queue.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface ExportRequestDto {
  video: {
    url: string;
    duration: number;
  };
  elements: Array<{
    id: string;
    type: string;
    startTime: number;
    duration: number;
    content: any;
  }>;
  config: {
    platform: string;
    format: string;
    preset: string;
    customConfig?: {
      resolution: string;
      bitrate: string;
      quality: string;
    };
  };
}

@ApiTags('Export')
@Controller('export')
export class ExportController {
  constructor(private readonly conversionQueue: ConversionQueueService) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar una nueva exportación de video' })
  @ApiResponse({ status: 201, description: 'Exportación iniciada correctamente' })
  async startExport(@Body() request: ExportRequestDto) {
    const jobId = await this.conversionQueue.addJob(
      request.video.url,
      request.config.platform,
      request.config.format,
      request.config.preset,
      request.config.customConfig,
    );

    return {
      jobId,
      message: 'Exportación iniciada correctamente',
    };
  }

  @Get(':jobId')
  @ApiOperation({ summary: 'Obtener el estado de una exportación' })
  @ApiResponse({ status: 200, description: 'Estado de la exportación' })
  getExportStatus(@Param('jobId') jobId: string) {
    const status = this.conversionQueue.getJobStatus(jobId);
    if (!status) {
      return {
        error: 'Trabajo de exportación no encontrado',
      };
    }
    return status;
  }

  @Delete(':jobId')
  @ApiOperation({ summary: 'Cancelar una exportación en curso' })
  @ApiResponse({ status: 200, description: 'Exportación cancelada correctamente' })
  cancelExport(@Param('jobId') jobId: string) {
    const cancelled = this.conversionQueue.cancelJob(jobId);
    if (!cancelled) {
      return {
        error: 'No se pudo cancelar la exportación',
      };
    }
    return {
      message: 'Exportación cancelada correctamente',
    };
  }
} 
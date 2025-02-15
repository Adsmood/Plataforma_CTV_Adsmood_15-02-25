import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ConversionQueueService } from '../services/conversion-queue.service';
import { VideoConverterService } from '../services/video-converter.service';
import { PlatformSpec } from '../types/platforms';
import { v4 as uuidv4 } from 'uuid';

interface ExportRequestDto {
    sourceVideo: string;
    platforms: PlatformSpec[];
    campaignId: string;
    advertiserId: string;
    interactiveData?: {
        overlayUrl?: string;
        clickThroughUrl: string;
        customParams?: Record<string, string>;
    };
}

@Controller('export')
export class ExportController {
    constructor(
        private readonly conversionQueue: ConversionQueueService,
        private readonly videoConverter: VideoConverterService
    ) {}

    @Post()
    async startExport(@Body() request: ExportRequestDto) {
        try {
            // Validar que el video existe
            const metadata = await this.videoConverter.getVideoMetadata(request.sourceVideo);
            
            // Validar duración máxima para cada plataforma
            for (const platform of request.platforms) {
                if (metadata.duration > platform.maxDuration) {
                    throw new HttpException(
                        `El video excede la duración máxima para ${platform.name} (${platform.maxDuration}s)`,
                        HttpStatus.BAD_REQUEST
                    );
                }
            }

            // Generar ID único para la exportación
            const exportId = uuidv4();

            // Agregar a la cola de conversión
            await this.conversionQueue.addToQueue(
                exportId,
                request.sourceVideo,
                request.platforms
            );

            return {
                exportId,
                status: 'processing',
                message: 'Exportación iniciada'
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al iniciar la exportación',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':id/status')
    getExportStatus(@Param('id') id: string) {
        const status = this.conversionQueue.getStatus(id);
        
        if (!status) {
            throw new HttpException(
                'Exportación no encontrada',
                HttpStatus.NOT_FOUND
            );
        }

        return {
            status: status.status,
            progress: status.progress,
            results: status.status === 'completed' ? status.results : undefined,
            error: status.error
        };
    }

    @Post('validate')
    async validateExport(@Body() request: ExportRequestDto) {
        try {
            const metadata = await this.videoConverter.getVideoMetadata(request.sourceVideo);
            const errors: { platform: string; issues: string[] }[] = [];

            for (const platform of request.platforms) {
                const issues: string[] = [];

                // Validar duración
                if (metadata.duration > platform.maxDuration) {
                    issues.push(`Duración excede el límite de ${platform.maxDuration}s`);
                }

                // Validar resolución
                const maxResolution = platform.videoFormats
                    .map(f => f.resolution)
                    .sort()
                    .pop();
                
                if (maxResolution === '1080p' && metadata.height > 1080) {
                    issues.push('Resolución superior a 1080p no soportada');
                }

                // Validar interactividad
                if (!platform.interactivitySupport && request.interactiveData) {
                    issues.push('Interactividad no soportada en esta plataforma');
                }

                if (issues.length > 0) {
                    errors.push({
                        platform: platform.name,
                        issues
                    });
                }
            }

            return {
                isValid: errors.length === 0,
                errors
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al validar la exportación',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
} 
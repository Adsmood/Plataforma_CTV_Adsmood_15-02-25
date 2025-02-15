import { Injectable, Logger } from '@nestjs/common';
import { VideoConverterService } from './video-converter.service';
import { StorageService } from './storage.service';
import * as path from 'path';
import * as fs from 'fs';
import { PlatformSpec } from '../types/platforms';

interface QueueItem {
    id: string;
    sourceVideo: string;
    platforms: PlatformSpec[];
    outputDir: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    results: {
        platform: string;
        variants: {
            url: string;
            format: {
                codec: string;
                resolution: string;
                fps: number;
                bitrate: number;
            };
        }[];
        interactiveResources?: {
            type: string;
            url: string;
            id: string;
        }[];
    }[];
    error?: string;
}

@Injectable()
export class ConversionQueueService {
    private readonly logger = new Logger(ConversionQueueService.name);
    private queue: Map<string, QueueItem> = new Map();
    private processing: boolean = false;

    constructor(
        private readonly videoConverter: VideoConverterService,
        private readonly storageService: StorageService
    ) {
        // Crear directorio de trabajo si no existe
        const workDir = path.join(process.cwd(), 'uploads', 'conversions');
        if (!fs.existsSync(workDir)) {
            fs.mkdirSync(workDir, { recursive: true });
        }

        // Iniciar limpieza automática cada 6 horas
        setInterval(() => {
            this.storageService.cleanOldFiles('conversions', 24)
                .catch(error => this.logger.error('Error cleaning old files:', error));
        }, 6 * 60 * 60 * 1000);
    }

    async addToQueue(
        id: string,
        sourceVideo: string,
        platforms: PlatformSpec[],
        interactiveData?: any
    ): Promise<string> {
        const outputDir = path.join(process.cwd(), 'uploads', 'conversions', id);
        
        const queueItem: QueueItem = {
            id,
            sourceVideo,
            platforms,
            outputDir,
            status: 'pending',
            progress: 0,
            results: []
        };

        this.queue.set(id, queueItem);
        this.processQueue();

        return id;
    }

    private async processQueue() {
        if (this.processing || this.queue.size === 0) return;

        this.processing = true;
        const pendingItems = Array.from(this.queue.values())
            .filter(item => item.status === 'pending');

        for (const item of pendingItems) {
            try {
                await this.processItem(item);
            } catch (error) {
                this.logger.error(`Error processing item ${item.id}:`, error);
                item.status = 'failed';
                item.error = error.message;
            }
        }

        this.processing = false;
        
        if (this.queue.size > 0) {
            this.processQueue();
        }
    }

    private async processItem(item: QueueItem) {
        item.status = 'processing';
        const totalVariants = item.platforms.reduce(
            (acc, platform) => acc + platform.videoFormats.length, 
            0
        );
        let processedVariants = 0;

        try {
            const metadata = await this.videoConverter.getVideoMetadata(item.sourceVideo);

            // Generar y guardar thumbnail
            const thumbnailPath = path.join(item.outputDir, 'thumbnail.jpg');
            await this.videoConverter.generateThumbnail(
                item.sourceVideo,
                thumbnailPath,
                Math.min(metadata.duration / 2, 5)
            );
            const thumbnailUrl = await this.storageService.saveFile(
                await fs.promises.readFile(thumbnailPath),
                `${item.id}_thumbnail.jpg`
            );

            // Procesar cada plataforma
            for (const platform of item.platforms) {
                const platformResults = {
                    platform: platform.id,
                    variants: [],
                    interactiveResources: []
                };

                // Procesar variantes de video
                for (const format of platform.videoFormats) {
                    const outputFilename = `${platform.id}_${format.resolution}_${format.codec}.mp4`;
                    const outputPath = path.join(item.outputDir, outputFilename);

                    await this.videoConverter.convertVideo({
                        inputPath: item.sourceVideo,
                        outputPath,
                        format
                    });

                    // Guardar el archivo convertido
                    const videoUrl = await this.storageService.saveFile(
                        await fs.promises.readFile(outputPath),
                        `${item.id}_${outputFilename}`
                    );

                    platformResults.variants.push({
                        url: videoUrl,
                        format: {
                            codec: format.codec,
                            resolution: format.resolution,
                            fps: format.fps,
                            bitrate: format.maxBitrate
                        }
                    });

                    // Limpiar archivo temporal
                    await fs.promises.unlink(outputPath);

                    processedVariants++;
                    item.progress = (processedVariants / totalVariants) * 100;
                }

                // Procesar recursos interactivos si la plataforma los soporta
                if (platform.interactivitySupport) {
                    // Generar y guardar VPAID script específico de la plataforma
                    const vpaidFilename = `${platform.id}_vpaid.js`;
                    const vpaidPath = path.join(item.outputDir, vpaidFilename);
                    await this.generateVpaidScript(platform.id, vpaidPath);
                    const vpaidUrl = await this.storageService.saveFile(
                        await fs.promises.readFile(vpaidPath),
                        `${item.id}_${vpaidFilename}`,
                        'vpaid'
                    );
                    platformResults.interactiveResources.push({
                        type: 'vpaid',
                        url: vpaidUrl,
                        id: 'vpaid_script'
                    });

                    // Limpiar archivo temporal
                    await fs.promises.unlink(vpaidPath);
                }

                item.results.push(platformResults);
            }

            // Limpiar directorio temporal
            await fs.promises.rm(item.outputDir, { recursive: true, force: true });

            item.status = 'completed';
        } catch (error) {
            item.status = 'failed';
            item.error = error.message;
            throw error;
        }
    }

    private async generateVpaidScript(platform: string, outputPath: string): Promise<void> {
        // Aquí generaríamos el script VPAID específico para cada plataforma
        // Por ahora, solo copiamos una plantilla base
        const templatePath = path.join(process.cwd(), 'templates', 'vpaid', `${platform}.js`);
        await fs.promises.copyFile(templatePath, outputPath);
    }

    getStatus(id: string): QueueItem | undefined {
        return this.queue.get(id);
    }

    removeFromQueue(id: string) {
        const item = this.queue.get(id);
        if (item && item.status === 'completed') {
            // Limpiar archivos asociados
            item.results.forEach(platformResult => {
                platformResult.variants.forEach(variant => {
                    const filename = path.basename(variant.url);
                    this.storageService.deleteFile(filename)
                        .catch(error => this.logger.error(`Error deleting file ${filename}:`, error));
                });

                platformResult.interactiveResources?.forEach(resource => {
                    const filename = path.basename(resource.url);
                    this.storageService.deleteFile(filename, 'vpaid')
                        .catch(error => this.logger.error(`Error deleting file ${filename}:`, error));
                });
            });
        }
        this.queue.delete(id);
    }
} 
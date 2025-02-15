import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Impression } from './entities/impression.entity';
import { VideoEvent } from './entities/video-event.entity';
import { Interaction } from './entities/interaction.entity';

interface TrackingData {
    platform: string;
    timestamp: number;
    userAgent?: string;
    ip?: string;
}

interface EventData extends TrackingData {
    event: string;
    progress?: number;
}

interface InteractionData extends TrackingData {
    type: string;
    data?: any;
}

@Injectable()
export class TrackingService {
    private readonly logger = new Logger(TrackingService.name);

    constructor(
        @InjectRepository(Impression)
        private impressionsRepository: Repository<Impression>,
        @InjectRepository(VideoEvent)
        private eventsRepository: Repository<VideoEvent>,
        @InjectRepository(Interaction)
        private interactionsRepository: Repository<Interaction>
    ) {}

    async trackImpression(id: string, data: TrackingData) {
        try {
            const impression = this.impressionsRepository.create({
                creativeId: id,
                timestamp: new Date(data.timestamp),
                platform: data.platform,
                deviceType: this.getDeviceType(data.userAgent),
                ipAddress: data.ip,
                userAgent: data.userAgent,
                ...await this.getGeoData(data.ip)
            });

            await this.impressionsRepository.save(impression);
            this.logger.log(`Impresión registrada para creative ${id}`);

            return { success: true, impressionId: impression.id };
        } catch (error) {
            this.logger.error(`Error al registrar impresión: ${error.message}`);
            throw error;
        }
    }

    async trackEvent(id: string, data: EventData) {
        try {
            const event = this.eventsRepository.create({
                impressionId: id,
                eventType: data.event,
                timestamp: new Date(data.timestamp),
                progressPercent: data.progress,
                platform: data.platform
            });

            await this.eventsRepository.save(event);
            this.logger.log(`Evento ${data.event} registrado para creative ${id}`);

            return { success: true, eventId: event.id };
        } catch (error) {
            this.logger.error(`Error al registrar evento: ${error.message}`);
            throw error;
        }
    }

    async trackInteraction(id: string, data: InteractionData) {
        try {
            const interaction = this.interactionsRepository.create({
                impressionId: id,
                interactionType: data.type,
                timestamp: new Date(data.timestamp),
                metadata: data.data,
                platform: data.platform
            });

            await this.interactionsRepository.save(interaction);
            this.logger.log(`Interacción ${data.type} registrada para creative ${id}`);

            return { success: true, interactionId: interaction.id };
        } catch (error) {
            this.logger.error(`Error al registrar interacción: ${error.message}`);
            throw error;
        }
    }

    private getDeviceType(userAgent?: string): string {
        if (!userAgent) return 'unknown';

        // Implementación básica, se puede mejorar con una biblioteca como 'device-detector-js'
        if (userAgent.includes('TV') || userAgent.includes('SmartTV')) return 'smarttv';
        if (userAgent.includes('Roku')) return 'roku';
        if (userAgent.includes('FireTV')) return 'firetv';
        if (userAgent.includes('AppleTV')) return 'appletv';
        if (userAgent.includes('Android TV')) return 'androidtv';
        
        return 'other';
    }

    private async getGeoData(ip?: string): Promise<{ country?: string; region?: string }> {
        if (!ip) return {};

        try {
            // TODO: Implementar integración con servicio de geolocalización
            // Por ahora retornamos datos mock
            return {
                country: 'US',
                region: 'CA'
            };
        } catch (error) {
            this.logger.error(`Error al obtener datos geo: ${error.message}`);
            return {};
        }
    }

    async getStats(id: string): Promise<{
        impressions: number;
        uniqueDevices: number;
        completionRate: number;
        interactionRate: number;
        avgWatchTime: number;
        events: Record<string, number>;
        interactions: Record<string, number>;
    }> {
        try {
            // Obtener todas las impresiones para este creativo
            const impressions = await this.impressionsRepository.find({
                where: { creativeId: id },
                relations: ['events', 'interactions']
            });

            // Calcular estadísticas básicas
            const uniqueDevices = new Set(impressions.map(imp => `${imp.deviceType}_${imp.ipAddress}`)).size;
            
            // Calcular eventos totales
            const events: Record<string, number> = {};
            const interactions: Record<string, number> = {};
            let completeViews = 0;
            let totalWatchTime = 0;

            for (const impression of impressions) {
                // Contar eventos
                impression.events.forEach(event => {
                    events[event.eventType] = (events[event.eventType] || 0) + 1;
                    if (event.eventType === 'complete') completeViews++;
                    if (event.progressPercent) {
                        totalWatchTime += event.progressPercent;
                    }
                });

                // Contar interacciones
                impression.interactions.forEach(interaction => {
                    interactions[interaction.interactionType] = (interactions[interaction.interactionType] || 0) + 1;
                });
            }

            // Calcular tasas
            const completionRate = impressions.length > 0 ? (completeViews / impressions.length) * 100 : 0;
            const interactionRate = impressions.length > 0 ? 
                (impressions.filter(imp => imp.interactions.length > 0).length / impressions.length) * 100 : 0;
            const avgWatchTime = impressions.length > 0 ? totalWatchTime / impressions.length : 0;

            return {
                impressions: impressions.length,
                uniqueDevices,
                completionRate,
                interactionRate,
                avgWatchTime,
                events,
                interactions
            };
        } catch (error) {
            this.logger.error(`Error al obtener estadísticas: ${error.message}`);
            throw error;
        }
    }

    async getEvents(
        id: string,
        startDate?: string,
        endDate?: string
    ): Promise<{
        events: Array<{
            type: string;
            timestamp: Date;
            platform: string;
            progress?: number;
            deviceType?: string;
            country?: string;
        }>;
        interactions: Array<{
            type: string;
            timestamp: Date;
            platform: string;
            metadata?: any;
            deviceType?: string;
            country?: string;
        }>;
    }> {
        try {
            // Construir query base
            const queryBuilder = this.impressionsRepository
                .createQueryBuilder('impression')
                .where('impression.creativeId = :id', { id })
                .leftJoinAndSelect('impression.events', 'event')
                .leftJoinAndSelect('impression.interactions', 'interaction');

            // Aplicar filtros de fecha si se proporcionan
            if (startDate) {
                queryBuilder.andWhere('impression.timestamp >= :startDate', { 
                    startDate: new Date(startDate) 
                });
            }
            if (endDate) {
                queryBuilder.andWhere('impression.timestamp <= :endDate', { 
                    endDate: new Date(endDate) 
                });
            }

            const impressions = await queryBuilder.getMany();

            // Formatear resultados
            const events = [];
            const interactions = [];

            for (const impression of impressions) {
                // Procesar eventos
                events.push(...impression.events.map(event => ({
                    type: event.eventType,
                    timestamp: event.timestamp,
                    platform: event.platform,
                    progress: event.progressPercent,
                    deviceType: impression.deviceType,
                    country: impression.country
                })));

                // Procesar interacciones
                interactions.push(...impression.interactions.map(interaction => ({
                    type: interaction.interactionType,
                    timestamp: interaction.timestamp,
                    platform: interaction.platform,
                    metadata: interaction.metadata,
                    deviceType: impression.deviceType,
                    country: impression.country
                })));
            }

            // Ordenar por timestamp
            events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            interactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            return { events, interactions };
        } catch (error) {
            this.logger.error(`Error al obtener eventos: ${error.message}`);
            throw error;
        }
    }
} 
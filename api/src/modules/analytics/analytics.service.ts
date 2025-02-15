import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Impression } from '../tracking/entities/impression.entity';
import { VideoEvent } from '../tracking/entities/video-event.entity';
import { Interaction } from '../tracking/entities/interaction.entity';

interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

@Injectable()
export class AnalyticsService {
    private readonly logger = new Logger(AnalyticsService.name);

  constructor(
        @InjectRepository(Impression)
        private readonly impressionRepository: Repository<Impression>,
        @InjectRepository(VideoEvent)
        private readonly eventRepository: Repository<VideoEvent>,
        @InjectRepository(Interaction)
        private readonly interactionRepository: Repository<Interaction>
    ) {}

    async getStats(creativeId: string, dateRange?: DateRange) {
        const query = this.impressionRepository
            .createQueryBuilder('impression')
            .where('impression.creativeId = :creativeId', { creativeId });

        if (dateRange?.startDate) {
            query.andWhere('impression.timestamp >= :startDate', { startDate: dateRange.startDate });
        }
        if (dateRange?.endDate) {
            query.andWhere('impression.timestamp <= :endDate', { endDate: dateRange.endDate });
        }

        const impressions = await query.getCount();
        const uniqueDevices = await query
            .distinctOn(['impression.deviceType'])
            .getCount();

        // Obtener eventos de video
        const events = await this.eventRepository
            .createQueryBuilder('event')
            .innerJoin('event.impression', 'impression')
            .where('impression.creativeId = :creativeId', { creativeId })
            .andWhere('event.eventType IN (:...types)', {
                types: ['start', 'complete', 'firstQuartile', 'midpoint', 'thirdQuartile']
            })
            .getMany();

        // Calcular tasa de completado
        const starts = events.filter(e => e.eventType === 'start').length;
        const completes = events.filter(e => e.eventType === 'complete').length;
        const completionRate = starts > 0 ? (completes / starts) * 100 : 0;

        // Obtener interacciones
        const interactions = await this.interactionRepository
            .createQueryBuilder('interaction')
            .innerJoin('interaction.impression', 'impression')
            .where('impression.creativeId = :creativeId', { creativeId })
            .getMany();

        // Calcular tasa de interacción
        const interactionRate = impressions > 0 ? (interactions.length / impressions) * 100 : 0;

        // Calcular tiempo promedio de visualización
        const avgWatchTime = await this.calculateAverageWatchTime(creativeId, dateRange);

        return {
            impressions,
            uniqueDevices,
            completionRate,
            interactionRate,
            avgWatchTime,
            events: this.groupEventsByType(events),
            interactions: this.groupInteractionsByType(interactions)
        };
    }

    async getEvents(creativeId: string, dateRange?: DateRange) {
        const query = this.eventRepository
            .createQueryBuilder('event')
            .innerJoinAndSelect('event.impression', 'impression')
            .where('impression.creativeId = :creativeId', { creativeId })
            .orderBy('event.timestamp', 'DESC');

        if (dateRange?.startDate) {
            query.andWhere('event.timestamp >= :startDate', { startDate: dateRange.startDate });
        }
        if (dateRange?.endDate) {
            query.andWhere('event.timestamp <= :endDate', { endDate: dateRange.endDate });
        }

        const events = await query.getMany();

        return {
            events: events.map(event => ({
                type: event.eventType,
                timestamp: event.timestamp,
                platform: event.impression.platform,
                progress: event.progressPercent,
                deviceType: event.impression.deviceType,
                country: event.impression.country
            }))
        };
    }

    async getPlatformStats(creativeId: string, dateRange?: DateRange) {
        const query = this.impressionRepository
            .createQueryBuilder('impression')
            .select('impression.platform', 'platform')
            .addSelect('COUNT(*)', 'impressions')
            .addSelect('COUNT(DISTINCT impression.deviceType)', 'uniqueDevices')
            .where('impression.creativeId = :creativeId', { creativeId })
            .groupBy('impression.platform');

        if (dateRange?.startDate) {
            query.andWhere('impression.timestamp >= :startDate', { startDate: dateRange.startDate });
        }
        if (dateRange?.endDate) {
            query.andWhere('impression.timestamp <= :endDate', { endDate: dateRange.endDate });
        }

        return query.getRawMany();
    }

    async getInteractions(creativeId: string, dateRange?: DateRange) {
        const query = this.interactionRepository
            .createQueryBuilder('interaction')
            .innerJoinAndSelect('interaction.impression', 'impression')
            .where('impression.creativeId = :creativeId', { creativeId })
            .orderBy('interaction.timestamp', 'DESC');

        if (dateRange?.startDate) {
            query.andWhere('interaction.timestamp >= :startDate', { startDate: dateRange.startDate });
        }
        if (dateRange?.endDate) {
            query.andWhere('interaction.timestamp <= :endDate', { endDate: dateRange.endDate });
        }

        const interactions = await query.getMany();

        return {
            interactions: interactions.map(interaction => ({
                type: interaction.interactionType,
                timestamp: interaction.timestamp,
                platform: interaction.impression.platform,
                metadata: interaction.metadata,
                deviceType: interaction.impression.deviceType,
                country: interaction.impression.country
            }))
        };
    }

    private async calculateAverageWatchTime(creativeId: string, dateRange?: DateRange): Promise<number> {
        const query = this.eventRepository
            .createQueryBuilder('event')
            .innerJoin('event.impression', 'impression')
            .where('impression.creativeId = :creativeId', { creativeId })
            .andWhere('event.eventType IN (:...types)', {
                types: ['complete', 'skip']
            });

        if (dateRange?.startDate) {
            query.andWhere('event.timestamp >= :startDate', { startDate: dateRange.startDate });
        }
        if (dateRange?.endDate) {
            query.andWhere('event.timestamp <= :endDate', { endDate: dateRange.endDate });
        }

        const events = await query.getMany();
        
        if (events.length === 0) return 0;

        const totalProgress = events.reduce((sum, event) => {
            if (event.eventType === 'complete') return sum + 100;
            return sum + (event.progressPercent || 0);
        }, 0);

        return (totalProgress / events.length) * 0.3; // Asumiendo que 100% = 30 segundos
    }

    private groupEventsByType(events: VideoEvent[]): Record<string, number> {
        return events.reduce((acc, event) => {
            acc[event.eventType] = (acc[event.eventType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }

    private groupInteractionsByType(interactions: Interaction[]): Record<string, number> {
        return interactions.reduce((acc, interaction) => {
            acc[interaction.interactionType] = (acc[interaction.interactionType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
  }
} 
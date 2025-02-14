import { TrackingService } from './tracking.service';
import { TrackEventDto, TrackingQueryDto } from './dto/tracking.dto';
import { ConfigService } from '@nestjs/config';
export declare class TrackingController {
    private readonly trackingService;
    private readonly config;
    constructor(trackingService: TrackingService, config: ConfigService);
    trackImpression(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackStart(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackFirstQuartile(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackMidpoint(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackThirdQuartile(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackComplete(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackClick(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackMute(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackUnmute(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackPause(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackResume(id: string, query: TrackingQueryDto, userAgent: string, ip: string): Promise<void>;
    trackInteractiveEvent(id: string, event: TrackEventDto, userAgent: string, ip: string): Promise<void>;
    getMetrics(id: string): Promise<{
        metrics: {
            adId: string;
            id: string;
            impressions: number;
            starts: number;
            firstQuartiles: number;
            midpoints: number;
            thirdQuartiles: number;
            completes: number;
            clicks: number;
            mutes: number;
            unmutes: number;
            pauses: number;
            resumes: number;
            fullscreen: number;
            exitFullscreen: number;
            createdAt: Date;
            updatedAt: Date;
        };
        recentEvents: {
            type: string;
            adId: string;
            id: string;
            userAgent: string | null;
            timestamp: Date;
            createdAt: Date;
            ipAddress: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        queuedEvents: number;
    }>;
    getAggregatedMetrics(period?: 'hour' | 'day' | 'week' | 'month'): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.TrackingEventGroupByOutputType, ("type" | "adId")[]> & {
        _count: number;
    })[]>;
}

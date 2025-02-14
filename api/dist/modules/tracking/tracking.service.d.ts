import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class TrackingService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly config;
    private eventQueue;
    private readonly batchSize;
    private readonly flushInterval;
    private flushTimeout;
    constructor(prisma: PrismaService, config: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private scheduleFlush;
    private flushEvents;
    private processBatch;
    trackEvent(event: string, adId: string, data: Record<string, any>): Promise<{
        success: boolean;
        queued: number;
    }>;
    getMetrics(adId: string): Promise<{
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

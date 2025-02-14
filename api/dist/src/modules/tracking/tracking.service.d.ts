import { PrismaService } from '../../prisma/prisma.service';
export declare class TrackingService {
    private prisma;
    constructor(prisma: PrismaService);
    trackEvent(type: string, adId: string, metadata: any): Promise<void>;
    private updateMetrics;
    getMetrics(adId: string): Promise<{
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
    }>;
    getEvents(adId: string, type?: string): Promise<{
        type: string;
        adId: string;
        id: string;
        userAgent: string | null;
        timestamp: Date;
        createdAt: Date;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
}

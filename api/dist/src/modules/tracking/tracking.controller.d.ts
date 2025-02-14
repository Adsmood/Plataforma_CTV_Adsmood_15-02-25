import { TrackingService } from './tracking.service';
import { GetEventsQueryDto } from './dto/tracking.dto';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    trackEvent(type: string, adId: string, metadata: Record<string, any>): Promise<{
        success: boolean;
    }>;
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
    getEvents(adId: string, query: GetEventsQueryDto): Promise<{
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

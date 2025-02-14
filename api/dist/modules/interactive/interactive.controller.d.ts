import { InteractiveService } from './interactive.service';
import { CreateInteractionDto, CreateOverlayDto, UpdateInteractionDto, UpdateOverlayDto } from './dto/interactive.dto';
export declare class InteractiveController {
    private readonly interactiveService;
    constructor(interactiveService: InteractiveService);
    createInteraction(adId: string, dto: CreateInteractionDto): Promise<{
        id: string;
        type: string;
        config: any;
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
        startTime: number;
        endTime?: number | null;
        adId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateInteraction(id: string, dto: UpdateInteractionDto): Promise<{
        id: string;
        type: string;
        config: any;
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
        startTime: number;
        endTime?: number | null;
        adId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteInteraction(id: string): Promise<void>;
    getInteractions(adId: string): Promise<{
        id: string;
        type: string;
        config: any;
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
        startTime: number;
        endTime?: number | null;
        adId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createOverlay(adId: string, dto: CreateOverlayDto): Promise<{
        id: string;
        type: string;
        content: string;
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
        startTime: number;
        endTime?: number | null;
        zIndex: number;
        styles?: any | null;
        adId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateOverlay(id: string, dto: UpdateOverlayDto): Promise<{
        id: string;
        type: string;
        content: string;
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
        startTime: number;
        endTime?: number | null;
        zIndex: number;
        styles?: any | null;
        adId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteOverlay(id: string): Promise<void>;
    getOverlays(adId: string): Promise<{
        id: string;
        type: string;
        content: string;
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
        startTime: number;
        endTime?: number | null;
        zIndex: number;
        styles?: any | null;
        adId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getInteractiveData(adId: string): Promise<{
        interactions: {
            id: string;
            type: string;
            config: any;
            position: {
                x: number;
                y: number;
            };
            size: {
                width: number;
                height: number;
            };
            startTime: number;
            endTime?: number | null;
            adId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        overlays: {
            id: string;
            type: string;
            content: string;
            position: {
                x: number;
                y: number;
            };
            size: {
                width: number;
                height: number;
            };
            startTime: number;
            endTime?: number | null;
            zIndex: number;
            styles?: any | null;
            adId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
}

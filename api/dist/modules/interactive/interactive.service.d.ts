import { PrismaService } from '../../prisma/prisma.service';
import { CreateInteractionDto, CreateOverlayDto, UpdateInteractionDto, UpdateOverlayDto } from './dto/interactive.dto';
type InteractionWithParsedJson = {
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
};
type OverlayWithParsedJson = {
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
};
export declare class InteractiveService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createInteraction(adId: string, dto: CreateInteractionDto): Promise<InteractionWithParsedJson>;
    updateInteraction(id: string, dto: UpdateInteractionDto): Promise<InteractionWithParsedJson>;
    deleteInteraction(id: string): Promise<void>;
    getInteractions(adId: string): Promise<InteractionWithParsedJson[]>;
    createOverlay(adId: string, dto: CreateOverlayDto): Promise<OverlayWithParsedJson>;
    updateOverlay(id: string, dto: UpdateOverlayDto): Promise<OverlayWithParsedJson>;
    deleteOverlay(id: string): Promise<void>;
    getOverlays(adId: string): Promise<OverlayWithParsedJson[]>;
    getInteractiveData(adId: string): Promise<{
        interactions: InteractionWithParsedJson[];
        overlays: OverlayWithParsedJson[];
    }>;
    private parseInteractionJson;
    private parseOverlayJson;
}
export {};

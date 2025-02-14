export declare class CreateOverlayDto {
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
    endTime?: number;
    zIndex?: number;
    styles?: Record<string, any>;
}
export declare class UpdateOverlayDto {
    type?: string;
    content?: string;
    position?: {
        x: number;
        y: number;
    };
    size?: {
        width: number;
        height: number;
    };
    startTime?: number;
    endTime?: number;
    zIndex?: number;
    styles?: Record<string, any>;
}

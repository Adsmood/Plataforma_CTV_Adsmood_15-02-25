export declare class CreateInteractionDto {
    type: string;
    config: Record<string, any>;
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
}
export declare class UpdateInteractionDto {
    type?: string;
    config?: Record<string, any>;
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
}

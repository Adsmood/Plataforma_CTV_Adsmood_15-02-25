export declare enum InteractionType {
    BUTTON = "button",
    CAROUSEL = "carousel",
    GALLERY = "gallery",
    TRIVIA = "trivia",
    QR = "qr",
    CHOICE = "choice"
}
export declare enum OverlayType {
    HTML = "html",
    IMAGE = "image",
    VIDEO = "video"
}
export declare class PositionDto {
    x: number;
    y: number;
}
export declare class SizeDto {
    width: number;
    height: number;
}
export declare class CreateInteractionDto {
    type: InteractionType;
    config: Record<string, any>;
    position: PositionDto;
    size: SizeDto;
    startTime: number;
    endTime?: number;
}
export declare class CreateOverlayDto {
    type: OverlayType;
    content: string;
    position: PositionDto;
    size: SizeDto;
    startTime: number;
    endTime?: number;
    zIndex: number;
    styles?: Record<string, any>;
}
export declare class UpdateInteractionDto extends CreateInteractionDto {
}
export declare class UpdateOverlayDto extends CreateOverlayDto {
}

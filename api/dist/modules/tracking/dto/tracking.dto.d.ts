export declare class TrackingQueryDto {
    cb?: string;
    ts?: string;
    campaignId?: string;
    creativeId?: string;
    insertionId?: string;
    siteId?: string;
    deviceId?: string;
}
export declare class TrackEventDto {
    type: string;
    data?: Record<string, any>;
}

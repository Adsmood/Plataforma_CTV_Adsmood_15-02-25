export interface PlatformSpec {
    id: string;
    name: string;
    videoFormats: {
        codec: 'h264' | 'h265';
        resolution: '720p' | '1080p' | '4K';
        fps: 30 | 60;
        maxBitrate: number; // en Mbps
    }[];
    vastVersion: '3.0' | '4.0' | '4.1' | '4.2';
    interactivitySupport: boolean;
    maxDuration: number; // en segundos
    skipOffset?: number; // en segundos
}

export const CTV_PLATFORMS: Record<string, PlatformSpec> = {
    roku: {
        id: 'roku',
        name: 'Roku',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 }
        ],
        vastVersion: '4.0',
        interactivitySupport: true,
        maxDuration: 60
    },
    fireTV: {
        id: 'fireTV',
        name: 'Amazon Fire TV',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 },
            { codec: 'h264', resolution: '4K', fps: 30, maxBitrate: 25 }
        ],
        vastVersion: '4.0',
        interactivitySupport: true,
        maxDuration: 60
    },
    appleTV: {
        id: 'appleTV',
        name: 'Apple TV',
        videoFormats: [
            { codec: 'h265', resolution: '4K', fps: 30, maxBitrate: 25 },
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 }
        ],
        vastVersion: '4.0',
        interactivitySupport: false,
        maxDuration: 60
    },
    androidTV: {
        id: 'androidTV',
        name: 'Google/Android TV',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 },
            { codec: 'h264', resolution: '4K', fps: 30, maxBitrate: 25 }
        ],
        vastVersion: '4.0',
        interactivitySupport: true,
        maxDuration: 60
    },
    samsungTV: {
        id: 'samsungTV',
        name: 'Samsung Smart TV',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 },
            { codec: 'h264', resolution: '4K', fps: 30, maxBitrate: 25 }
        ],
        vastVersion: '4.0',
        interactivitySupport: false,
        maxDuration: 60
    },
    lgTV: {
        id: 'lgTV',
        name: 'LG Smart TV',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 },
            { codec: 'h265', resolution: '4K', fps: 30, maxBitrate: 25 }
        ],
        vastVersion: '4.0',
        interactivitySupport: false,
        maxDuration: 60
    },
    vizio: {
        id: 'vizio',
        name: 'Vizio SmartCast',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 },
            { codec: 'h264', resolution: '4K', fps: 30, maxBitrate: 25 }
        ],
        vastVersion: '4.0',
        interactivitySupport: false,
        maxDuration: 60
    },
    hulu: {
        id: 'hulu',
        name: 'Hulu',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 }
        ],
        vastVersion: '4.0',
        interactivitySupport: false,
        maxDuration: 30
    },
    youtubeTV: {
        id: 'youtubeTV',
        name: 'YouTube TV',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 }
        ],
        vastVersion: '4.0',
        interactivitySupport: false,
        maxDuration: 60,
        skipOffset: 5
    },
    plutoTV: {
        id: 'plutoTV',
        name: 'Pluto TV',
        videoFormats: [
            { codec: 'h264', resolution: '720p', fps: 30, maxBitrate: 10 },
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 }
        ],
        vastVersion: '4.0',
        interactivitySupport: false,
        maxDuration: 30
    },
    peacock: {
        id: 'peacock',
        name: 'Peacock',
        videoFormats: [
            { codec: 'h264', resolution: '1080p', fps: 30, maxBitrate: 15 }
        ],
        vastVersion: '4.0',
        interactivitySupport: false,
        maxDuration: 30
    }
}; 
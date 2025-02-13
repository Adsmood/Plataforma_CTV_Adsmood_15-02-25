// Plataformas soportadas
export type Platform = 
  | 'roku'
  | 'fire_tv'
  | 'apple_tv'
  | 'android_tv'
  | 'samsung_tv'
  | 'lg_tv'
  | 'vizio'
  | 'hulu'
  | 'youtube_tv'
  | 'pluto_tv'
  | 'peacock';

// Configuración de exportación
export interface ExportConfig {
  resolution: '1080p' | '4k';
  fps: 30 | 60;
  bitrate: string;
  audioCodec: 'aac';
  audioRate: string;
  format: 'mp4' | 'zip';
  videoCodec: 'h264' | 'h265';
}

// Resultado de la exportación
export interface ExportResult {
  success: boolean;
  url: string;
  filename: string;
  config: ExportConfig;
  platform: Platform;
  timestamp: number;
  error?: string;
}

// Configuraciones predefinidas por plataforma
export const PLATFORM_CONFIGS: Record<Platform, Partial<ExportConfig>> = {
  roku: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  },
  fire_tv: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  },
  apple_tv: {
    resolution: '4k',
    fps: 60,
    videoCodec: 'h265'
  },
  android_tv: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  },
  samsung_tv: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  },
  lg_tv: {
    resolution: '4k',
    fps: 60,
    videoCodec: 'h265'
  },
  vizio: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  },
  hulu: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  },
  youtube_tv: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  },
  pluto_tv: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  },
  peacock: {
    resolution: '1080p',
    fps: 30,
    videoCodec: 'h264'
  }
}; 
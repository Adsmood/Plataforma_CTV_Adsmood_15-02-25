export interface VideoConfig {
  width: number;
  height: number;
  videoCodec: string;
  resolution: '1080p' | '4k';
  platform?: string;
  duration?: number;
} 
export interface ExportRequestDto {
  video: {
    url: string;
    duration: number;
  };
  elements: Array<{
    id: string;
    type: string;
    startTime: number;
    duration: number;
    content: any;
  }>;
  config: {
    platform: string;
    format: string;
    preset: string;
    customConfig?: {
      resolution: string;
      bitrate: string;
      quality: string;
    };
  };
}

export interface ConversionJob {
  id: string;
  inputUrl: string;
  platform: string;
  format: string;
  preset: string;
  customConfig?: {
    resolution: string;
    bitrate: string;
    quality: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: {
    url: string;
    thumbnailUrl: string;
  };
  error?: string;
}

export interface ConversionConfig {
  codec: string;
  resolution: string;
  bitrate: string;
  quality: string;
} 
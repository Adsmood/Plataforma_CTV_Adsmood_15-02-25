import { Platform, ExportConfig, ExportResult } from '../types/export';
import { captureCanvas } from './canvasService';

// Asegurarnos de que la URL tenga el protocolo correcto
const ensureValidUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

const ASSETS_URL = ensureValidUrl(import.meta.env.VITE_ASSETS_URL || 'adsmood-ctv-assets.onrender.com');

console.log('URL del servicio de assets:', ASSETS_URL);

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  resolution: '1080p',
  fps: 30,
  bitrate: '15000k', // 15 Mbps
  audioCodec: 'aac',
  audioRate: '48000',
  format: 'mp4',
  videoCodec: 'h264'
};

export const generateExportFilename = (
  projectName: string,
  platform: Platform,
  config: ExportConfig = DEFAULT_EXPORT_CONFIG
): string => {
  const timestamp = Date.now();
  const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${sanitizedName}_${timestamp}_${platform}_${config.resolution}.${config.format}`;
};

export const validateExportConfig = (config: Partial<ExportConfig>): ExportConfig => {
  return {
    ...DEFAULT_EXPORT_CONFIG,
    ...config,
  };
};

export const exportVideo = async (
  projectName: string,
  platform: Platform,
  customConfig?: Partial<ExportConfig>
): Promise<ExportResult> => {
  try {
    const config = validateExportConfig(customConfig || {});
    
    // Log de inicio de exportación
    console.log('Iniciando exportación:', {
      projectName,
      platform,
      config,
      assetsUrl: ASSETS_URL
    });

    // Capturar el canvas
    const canvasElement = document.querySelector('#canvas-container') as HTMLElement;
    const videoBlob = await captureCanvas(canvasElement, config);

    // Crear FormData con los parámetros
    const formData = new FormData();
    formData.append('file', videoBlob, projectName + '.mp4');
    formData.append('platform', platform);
    formData.append('config', JSON.stringify(config));

    // Construir URL del endpoint
    const exportUrl = `${ASSETS_URL}/export`;
    console.log('URL de exportación:', exportUrl);

    // Enviar al endpoint de exportación
    const response = await fetch(exportUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        `Error al exportar video (${response.status}: ${response.statusText})`
      );
    }

    const data = await response.json();
    
    // Construir URL completa del video
    const videoUrl = data.url.startsWith('http') 
      ? data.url 
      : `${ASSETS_URL}${data.url}`;
    
    return {
      success: true,
      url: videoUrl,
      filename: data.url.split('/').pop() || '',
      config: data.config,
      platform,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error en exportación:', error);
    throw new Error(`Error al exportar video: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}; 
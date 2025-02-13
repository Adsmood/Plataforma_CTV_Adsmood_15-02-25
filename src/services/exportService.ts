import { Platform, ExportConfig, ExportResult } from '../types/export';
import { captureCanvas } from './canvasService';

// Asegurarnos de que la URL tenga el protocolo correcto y termine correctamente
const ensureValidUrl = (url: string): string => {
  if (!url) {
    console.error('URL del servicio de assets no configurada');
    throw new Error('URL del servicio de assets no configurada');
  }
  
  // Limpiar la URL
  url = url.trim();
  
  // Asegurar protocolo
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  // Remover barra final si existe
  url = url.replace(/\/$/, '');
  
  // Validar formato de URL
  try {
    new URL(url);
  } catch (error) {
    console.error('URL inválida:', url);
    throw new Error(`URL inválida: ${url}`);
  }
  
  return url;
};

// Obtener la URL del servicio de assets
const getAssetsUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_ASSETS_URL;
  console.log('URL configurada en env:', configuredUrl);
  
  if (!configuredUrl) {
    console.warn('VITE_ASSETS_URL no está configurada, usando valor por defecto');
    return 'https://adsmood-ctv-assets.onrender.com';
  }
  
  // Asegurarnos que la URL sea la correcta de Render
  if (!configuredUrl.includes('onrender.com')) {
    console.warn('URL no válida, usando URL por defecto de Render');
    return 'https://adsmood-ctv-assets.onrender.com';
  }
  
  return ensureValidUrl(configuredUrl);
};

const ASSETS_URL = getAssetsUrl();

console.log('URL final del servicio de assets:', ASSETS_URL);

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
    if (!canvasElement) {
      throw new Error('Canvas no encontrado');
    }

    const videoBlob = await captureCanvas(canvasElement, config);

    // Crear FormData con los parámetros
    const formData = new FormData();
    const filename = generateExportFilename(projectName, platform, config);
    formData.append('file', videoBlob, filename);
    formData.append('platform', platform);
    formData.append('config', JSON.stringify(config));

    // Construir URL del endpoint
    const exportUrl = `${ASSETS_URL}/export`;
    console.log('URL de exportación:', exportUrl);

    // Validar URL antes de hacer el fetch
    try {
      new URL(exportUrl);
    } catch (error) {
      throw new Error(`URL de exportación inválida: ${exportUrl}`);
    }

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
    
    if (!data.success || !data.url) {
      throw new Error('La respuesta del servidor no incluye la URL del video');
    }

    // Construir URL completa del video
    const videoUrl = new URL(
      data.url.startsWith('http') ? data.url : `${ASSETS_URL}${data.url}`
    ).toString();
    
    console.log('URL del video exportado:', videoUrl);
    
    return {
      success: true,
      url: videoUrl,
      filename: data.url.split('/').pop() || filename,
      config: data.config || config,
      platform,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error en exportación:', error);
    throw new Error(`Error al exportar video: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}; 
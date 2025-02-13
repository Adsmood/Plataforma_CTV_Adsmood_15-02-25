import { ExportConfig } from '../types/export';

export const captureCanvas = async (
  canvasElement: HTMLElement | null,
  config: ExportConfig
): Promise<Blob> => {
  if (!canvasElement) {
    throw new Error('Canvas no encontrado');
  }

  try {
    // Importar html2canvas dinámicamente
    const html2canvas = (await import('html2canvas')).default;
    
    console.log('Iniciando captura del canvas:', {
      element: canvasElement,
      config
    });

    // Capturar el canvas
    const canvas = await html2canvas(canvasElement, {
      width: config.resolution === '4k' ? 3840 : 1920,
      height: config.resolution === '4k' ? 2160 : 1080,
      backgroundColor: '#000000',
      logging: false,
      useCORS: true,
      allowTaint: true,
      // @ts-ignore
      onclone: (doc: Document) => {
        // Remover elementos de control
        const controls = doc.querySelector('.controls-overlay');
        if (controls) controls.remove();
      }
    });

    // Convertir a video usando MediaRecorder
    const stream = canvas.captureStream(config.fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=h264',
      videoBitsPerSecond: parseInt(config.bitrate) * 1000
    });

    const chunks: Blob[] = [];
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: 'video/webm' });
          
          // Convertir a MP4 si es necesario
          if (config.format === 'mp4') {
            // TODO: Implementar conversión a MP4
            // Por ahora retornamos el webm
            resolve(blob);
          } else {
            resolve(blob);
          }
        } catch (error) {
          reject(error);
        }
      };

      // Iniciar grabación
      mediaRecorder.start();
      
      // Grabar por la duración del video
      setTimeout(() => {
        mediaRecorder.stop();
      }, 30000); // 30 segundos por defecto
    });
  } catch (error) {
    console.error('Error capturando canvas:', error);
    throw new Error(`Error capturando canvas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}; 
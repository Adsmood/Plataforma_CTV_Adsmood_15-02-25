import { ExportConfig } from '../types/export';
import { useEditorStore } from '../stores/editorStore';

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

    // Obtener la duración del timeline
    const timeline = useEditorStore.getState().timeline;
    const duration = timeline?.duration || 30; // Fallback a 30 segundos

    // Capturar el canvas
    const canvas = await html2canvas(canvasElement, {
      width: config.resolution === '4k' ? 3840 : 1920,
      height: config.resolution === '4k' ? 2160 : 1080,
      background: '#000000',
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

    // Configurar el MediaRecorder con las opciones adecuadas
    const stream = canvas.captureStream(config.fps);
    
    // Intentar obtener el codec solicitado
    let mimeType = 'video/webm;codecs=h264';
    if (config.videoCodec === 'h265' && MediaRecorder.isTypeSupported('video/webm;codecs=h265')) {
      mimeType = 'video/webm;codecs=h265';
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: parseInt(config.bitrate) * 1000
    });

    const chunks: Blob[] = [];
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onerror = (error: ErrorEvent) => {
        reject(new Error(`Error en MediaRecorder: ${error.message}`));
      };

      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: mimeType });
          
          // Convertir a MP4 si es necesario
          if (config.format === 'mp4') {
            // TODO: Implementar conversión a MP4 usando WebAssembly FFmpeg
            // Por ahora retornamos el webm
            console.warn('Conversión a MP4 no implementada, retornando WebM');
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
      
      // Grabar por la duración del timeline
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, duration * 1000);
    });
  } catch (error) {
    console.error('Error capturando canvas:', error);
    throw new Error(`Error capturando canvas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}; 
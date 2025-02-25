import React, { useState } from 'react';
import { Box, Stack, IconButton, Slider, Dialog } from '@mui/material';
import { Add as AddIcon, ZoomIn, CropFree } from '@mui/icons-material';
import { useEditorStore } from '../../stores/editorStore';
import FileUploader from './FileUploader';

interface Background {
  url: string;
  type: 'image' | 'video';
  style: {
    scale: number;
    position: { x: number; y: number };
  };
}

const BackgroundUploader: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { background, setBackground } = useEditorStore((state) => ({
    background: state.background,
    setBackground: state.setBackground,
  }));
  const [style, setStyle] = useState({
    scale: 1,
    position: { x: 50, y: 50 },
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileAccepted = async (file: File) => {
    try {
      setError(null);
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      // Usar la URL pública del servicio de assets
      const assetsUrl = 'https://adsmood-ctv-assets.onrender.com';
      
      console.log('URL del servicio de assets:', assetsUrl);
      console.log('Tipo de archivo:', file.type);
      console.log('Tamaño del archivo:', file.size);
      
      // Configuración común para fetch
      const fetchConfig = {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // No establecer Content-Type, dejamos que el navegador lo haga con el boundary correcto
        },
      };

      // Si es un video, primero subimos el archivo
      if (file.type.startsWith('video/')) {
        console.log('Subiendo video...');
        try {
          const response = await fetch(`${assetsUrl}/upload`, fetchConfig);
          console.log('Respuesta del servidor:', response.status, response.statusText);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Error del servidor:', errorData);
            throw new Error(
              errorData?.error || 
              `Error al subir el video (${response.status}: ${response.statusText})`
            );
          }

          const data = await response.json();
          if (!data.success || !data.url) {
            throw new Error('La respuesta del servidor no incluye la URL del video');
          }

          // Construir la URL absoluta del video
          const videoUrl = `${assetsUrl}${data.url}`;
          console.log('URL del video:', videoUrl);
          
          setBackground({
            url: videoUrl,
            type: 'video',
            style,
          });
        } catch (error) {
          console.error('Error detallado:', error);
          throw error;
        }
      } else {
        // Para imágenes
        console.log('Subiendo imagen...');
        try {
          const response = await fetch(`${assetsUrl}/upload`, fetchConfig);
          console.log('Respuesta del servidor:', response.status, response.statusText);

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Error del servidor:', errorData);
            throw new Error(
              errorData?.error || 
              `Error al subir la imagen (${response.status}: ${response.statusText})`
            );
          }

          const data = await response.json();
          if (!data.success || !data.url) {
            throw new Error('La respuesta del servidor no incluye la URL del archivo');
          }

          const fileUrl = `${assetsUrl}${data.url}`;
          console.log('URL de la imagen:', fileUrl);
          
          setBackground({
            url: fileUrl,
            type: 'image',
            style,
          });
        } catch (error) {
          console.error('Error detallado:', error);
          throw error;
        }
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Error al procesar el fondo:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Error desconocido al subir el archivo. Por favor, intenta de nuevo.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleStyleChange = (key: 'scale' | 'position', value: any) => {
    const newStyle = { ...style };
    if (key === 'position') {
      newStyle.position = { ...newStyle.position, ...value };
    } else {
      newStyle[key] = value;
    }
    setStyle(newStyle);
    if (background) {
      setBackground({
        ...background,
        style: newStyle,
      });
    }
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 1,
        }}
      >
        <IconButton 
          onClick={() => setOpen(true)}
          aria-label="Agregar fondo"
        >
          <AddIcon />
        </IconButton>
        
        {background && (
          <Box sx={{ width: 150 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ZoomIn sx={{ mr: 1 }} />
                <Slider
                  size="small"
                  value={style.scale}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onChange={(_: Event, value: number | number[]) => 
                    handleStyleChange('scale', Array.isArray(value) ? value[0] : value)
                  }
                  aria-label="Escala"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CropFree sx={{ mr: 1 }} />
                <Slider
                  size="small"
                  value={style.position.x}
                  min={0}
                  max={100}
                  onChange={(_: Event, value: number | number[]) =>
                    handleStyleChange('position', { x: Array.isArray(value) ? value[0] : value })
                  }
                  aria-label="Posición horizontal"
                />
              </Box>
              <Slider
                size="small"
                value={style.position.y}
                min={0}
                max={100}
                orientation="vertical"
                sx={{ height: 100 }}
                onChange={(_: Event, value: number | number[]) =>
                  handleStyleChange('position', { y: Array.isArray(value) ? value[0] : value })
                }
                aria-label="Posición vertical"
              />
            </Stack>
          </Box>
        )}
      </Stack>

      <Dialog
        open={open}
        onClose={() => !uploading && setOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="upload-dialog-title"
      >
        <Box sx={{ p: 2, height: 300 }} role="dialog" aria-modal="true">
          <FileUploader
            onFileAccepted={handleFileAccepted}
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg'],
              'video/*': ['.mp4', '.webm', '.ogg'],
            }}
            maxSize={52428800} // 50MB
            title="Arrastra una imagen o video aquí, o haz clic para seleccionar"
            icon={<AddIcon />}
            disabled={uploading}
            error={error}
          />
          {uploading && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              zIndex: 1
            }}
            role="progressbar"
            aria-label="Subiendo archivo"
            >
              Subiendo archivo...
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default BackgroundUploader; 
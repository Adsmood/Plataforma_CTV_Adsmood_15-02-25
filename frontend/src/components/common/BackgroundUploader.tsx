import React, { useState } from 'react';
import { Box, Stack, IconButton, Slider, Dialog, Tooltip, CircularProgress } from '@mui/material';
import { Add as AddIcon, ZoomIn, CropFree, VideoCall } from '@mui/icons-material';
import { useEditorStore } from '../../stores/editorStore';
import FileUploader from './FileUploader';
import { apiService } from '../../services/apiService';

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

      const result = await apiService.uploadAsset(file);

      if (result.success && result.url) {
        setBackground({
          url: result.url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          style,
        });
        setOpen(false);
      } else {
        throw new Error('Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Error en la subida:', error);
    setError(error.message);
  };

  const handleStyleChange = (key: 'scale' | 'position', value: any) => {
    const newStyle = {
      ...style,
      [key]: key === 'position' ? { ...style.position, ...value } : value,
    };
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
      <Tooltip title="Añadir Fondo" placement="right">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            width: '44px',
            height: '44px',
          }}
        >
          <VideoCall />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 2, height: 300, position: 'relative' }}>
          <FileUploader
            onFileAccepted={handleFileAccepted}
            onError={handleUploadError}
            accept={{
              'video/*': ['.mp4', '.webm', '.ogg'],
              'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
            }}
            maxSize={52428800} // 50MB
            title="Arrastra un video o imagen aquí, o haz clic para seleccionar"
            icon={<VideoCall />}
            error={error}
            disabled={uploading}
          />
          {uploading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default BackgroundUploader; 
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Stack, Dialog, Typography, Alert } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import FileUploader from '../../../../components/common/FileUploader';
import { useEditorStore } from '../../../../stores/editorStore';

interface CarouselElementProps {
  data: {
    images: string[];
    currentIndex?: number;
    style?: {
      scale: number;
      position: { x: number; y: number };
    };
  };
  isSelected: boolean;
  elementId?: string;
}

const CarouselElement: React.FC<CarouselElementProps> = ({ data, isSelected, elementId }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateElement = useEditorStore((state) => state.updateElement);
  const currentIndex = data.currentIndex || 0;
  const hasImages = data.images.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected || !hasImages) return;

      if (e.key === 'ArrowLeft') {
        handleNavigate('prev');
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        handleNavigate('next');
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, hasImages, currentIndex]);

  const handleFileAccepted = async (file: File) => {
    try {
      setError(null);
      const imageUrl = URL.createObjectURL(file);
      if (elementId) {
        updateElement(elementId, {
          content: {
            ...data,
            images: [...data.images, imageUrl],
            style: data.style || { scale: 1, position: { x: 50, y: 50 } },
          },
        });
      }
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Error en la subida:', error);
    setError(error.message);
  };

  const handleDeleteImage = (index: number) => {
    if (!elementId) return;

    const newImages = [...data.images];
    newImages.splice(index, 1);

    updateElement(elementId, {
      content: {
        ...data,
        images: newImages,
        currentIndex: Math.min(currentIndex, newImages.length - 1),
      },
    });
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!elementId || !hasImages) return;

    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + data.images.length) % data.images.length
      : (currentIndex + 1) % data.images.length;

    updateElement(elementId, {
      content: {
        ...data,
        currentIndex: newIndex,
      },
    });
  };

  const style = data.style || { scale: 1, position: { x: 50, y: 50 } };

  return (
    <Box
      tabIndex={isSelected ? 0 : -1}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        outline: 'none',
        '&:focus': {
          outline: isSelected ? '2px solid #fff' : 'none',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {hasImages ? (
          <Box
            component="img"
            src={data.images[currentIndex]}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: `scale(${style.scale}) translate(${style.position.x - 50}%, ${style.position.y - 50}%)`,
              transformOrigin: 'center',
              bgcolor: 'transparent',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Haz clic para añadir imágenes
          </Box>
        )}

        {hasImages && data.images.length > 1 && (
          <>
            <IconButton
              onClick={() => handleNavigate('prev')}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
                zIndex: 2,
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={() => handleNavigate('next')}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
                zIndex: 2,
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>

      {isSelected && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            },
            zIndex: 2,
          }}
        >
          <EditIcon />
        </IconButton>
      )}

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ height: 200 }}>
              <FileUploader
                onFileAccepted={handleFileAccepted}
                onError={handleUploadError}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg'],
                }}
                maxSize={5242880} // 5MB
                title="Arrastra una imagen aquí, o haz clic para seleccionar"
                icon={<EditIcon />}
                error={error}
              />
            </Box>

            {data.images.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Imágenes del carrusel
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 1,
                  }}
                >
                  {data.images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={image}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteImage(index)}
                        sx={{
                          position: 'absolute',
                          right: 4,
                          top: 4,
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CarouselElement; 
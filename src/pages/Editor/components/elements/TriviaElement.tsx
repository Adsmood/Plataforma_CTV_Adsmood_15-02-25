import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  Stack,
  Typography,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../../../stores/editorStore';
import FileUploader from '../../../../components/common/FileUploader';

interface TriviaOption {
  id: string;
  imageUrl: string;
  isCorrect: boolean;
}

interface TriviaElementProps {
  data: {
    questionImage?: string;
    options: TriviaOption[];
    layout: 'horizontal' | 'vertical';
    feedbackImages?: {
      correct?: string;
      incorrect?: string;
    };
    style?: {
      scale: number;
      backgroundColor: string;
      selectedColor: string;
      correctColor: string;
      incorrectColor: string;
    };
    selectedOption?: string | null;
    showResult?: boolean;
  };
  isSelected: boolean;
  elementId?: string;
}

const defaultStyle = {
  scale: 1,
  backgroundColor: '#2196f3',
  selectedColor: '#64b5f6',
  correctColor: '#4caf50',
  incorrectColor: '#f44336',
};

const TriviaElement: React.FC<TriviaElementProps> = ({ data, isSelected, elementId }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const updateElement = useEditorStore((state) => state.updateElement);

  const style = data.style || defaultStyle;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected || data.showResult) return;

      let newIndex = focusedOptionIndex;
      const optionsLength = data.options.length;

      switch (e.key) {
        case 'ArrowLeft':
          if (data.layout === 'horizontal') {
            newIndex = focusedOptionIndex <= 0 ? optionsLength - 1 : focusedOptionIndex - 1;
            e.preventDefault();
          }
          break;
        case 'ArrowRight':
          if (data.layout === 'horizontal') {
            newIndex = focusedOptionIndex >= optionsLength - 1 ? 0 : focusedOptionIndex + 1;
            e.preventDefault();
          }
          break;
        case 'ArrowUp':
          if (data.layout === 'vertical') {
            newIndex = focusedOptionIndex <= 0 ? optionsLength - 1 : focusedOptionIndex - 1;
            e.preventDefault();
          }
          break;
        case 'ArrowDown':
          if (data.layout === 'vertical') {
            newIndex = focusedOptionIndex >= optionsLength - 1 ? 0 : focusedOptionIndex + 1;
            e.preventDefault();
          }
          break;
        case 'Enter':
        case ' ':
          if (focusedOptionIndex >= 0) {
            handleOptionSelect(data.options[focusedOptionIndex].id);
            e.preventDefault();
          }
          break;
      }

      if (newIndex !== focusedOptionIndex) {
        setFocusedOptionIndex(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, data.layout, data.options, focusedOptionIndex, data.showResult]);

  const handleQuestionImageUpload = async (file: File) => {
    try {
      setError(null);
      const imageUrl = URL.createObjectURL(file);
      if (elementId) {
        updateElement(elementId, {
          content: {
            ...data,
            questionImage: imageUrl,
          },
        });
      }
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleQuestionImageError = (error: Error) => {
    console.error('Error en la subida de la imagen de pregunta:', error);
    setError(error.message);
  };

  const handleOptionImageUpload = async (file: File) => {
    try {
      setError(null);
      const imageUrl = URL.createObjectURL(file);
      const newOption: TriviaOption = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl,
        isCorrect: data.options.length === 0, // Primera opción es correcta por defecto
      };

      if (elementId) {
        updateElement(elementId, {
          content: {
            ...data,
            options: [...(data.options || []), newOption],
          },
        });
      }
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleOptionImageError = (error: Error) => {
    console.error('Error en la subida de la imagen de opción:', error);
    setError(error.message);
  };

  const handleDeleteOption = (optionId: string) => {
    if (!elementId) return;
    updateElement(elementId, {
      content: {
        ...data,
        options: data.options.filter(opt => opt.id !== optionId),
      },
    });
  };

  const handleCorrectOptionChange = (optionId: string) => {
    if (!elementId) return;
    updateElement(elementId, {
      content: {
        ...data,
        options: data.options.map(opt => ({
          ...opt,
          isCorrect: opt.id === optionId,
        })),
      },
    });
  };

  const handleLayoutChange = (layout: 'horizontal' | 'vertical') => {
    if (!elementId) return;
    updateElement(elementId, {
      content: {
        ...data,
        layout,
      },
    });
  };

  const handleStyleChange = (key: keyof typeof defaultStyle, value: any) => {
    if (!elementId) return;
    updateElement(elementId, {
      content: {
        ...data,
        style: {
          ...style,
          [key]: value,
        },
      },
    });
  };

  const handleOptionSelect = (optionId: string) => {
    if (!elementId || data.showResult) return;
    updateElement(elementId, {
      content: {
        ...data,
        selectedOption: optionId,
        showResult: true,
      },
    });
  };

  const handleReset = () => {
    if (!elementId) return;
    updateElement(elementId, {
      content: {
        ...data,
        selectedOption: null,
        showResult: false,
      },
    });
  };

  const handleFeedbackImageUpload = async (file: File, type: 'correct' | 'incorrect') => {
    try {
      setError(null);
      const imageUrl = URL.createObjectURL(file);
      if (elementId) {
        updateElement(elementId, {
          content: {
            ...data,
            feedbackImages: {
              ...data.feedbackImages,
              [type]: imageUrl,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleFeedbackImageError = (error: Error) => {
    console.error('Error en la subida de la imagen de feedback:', error);
    setError(error.message);
  };

  const handleDeleteFeedbackImage = (type: 'correct' | 'incorrect') => {
    if (!elementId) return;
    
    const newContent = {
      ...data,
      feedbackImages: {
        ...data.feedbackImages,
        [type]: '',
      },
    };
    
    updateElement(elementId, { content: newContent });
  };

  return (
    <Box
      tabIndex={isSelected ? 0 : -1}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        bgcolor: style.backgroundColor,
        outline: 'none',
        '&:focus': {
          outline: isSelected ? '2px solid #fff' : 'none',
        },
      }}
    >
      {data.questionImage ? (
        <Stack
          spacing={2}
          sx={{
            height: '100%',
            '& img': {
              maxWidth: '100%',
              objectFit: 'contain',
            },
          }}
        >
          <Box
            component="img"
            src={data.questionImage}
            sx={{
              width: '100%',
              height: '40%',
              objectFit: 'contain',
            }}
          />

          <Box
            sx={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: data.layout === 'horizontal' ? '1fr 1fr' : '1fr',
              gap: 2,
            }}
          >
            <AnimatePresence>
              {data.options.map((option) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    onClick={() => handleOptionSelect(option.id)}
                    sx={{
                      height: '100%',
                      bgcolor: data.selectedOption === option.id
                        ? data.showResult
                          ? option.isCorrect
                            ? style.correctColor
                            : style.incorrectColor
                          : style.selectedColor
                        : 'transparent',
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        filter: isSelected ? 'brightness(1.1)' : 'none',
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={option.imageUrl}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        p: 1,
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>

          {data.showResult && data.feedbackImages && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {data.options.find(opt => opt.id === data.selectedOption)?.isCorrect ? (
                  data.feedbackImages.correct && (
                    <Box
                      component="img"
                      src={data.feedbackImages.correct}
                      sx={{
                        maxWidth: '100%',
                        height: '100px',
                        objectFit: 'contain',
                        mb: 2,
                      }}
                    />
                  )
                ) : (
                  data.feedbackImages.incorrect && (
                    <Box
                      component="img"
                      src={data.feedbackImages.incorrect}
                      sx={{
                        maxWidth: '100%',
                        height: '100px',
                        objectFit: 'contain',
                        mb: 2,
                      }}
                    />
                  )
                )}
                <IconButton
                  onClick={handleReset}
                  sx={{
                    bgcolor: 'transparent',
                    '&:hover': { bgcolor: isSelected ? 'action.hover' : 'transparent' },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </motion.div>
            </Box>
          )}
        </Stack>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            bgcolor: 'transparent',
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Configura la trivia
        </Box>
      )}

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
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6" gutterBottom>
              Configurar Trivia
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Imagen de la pregunta
              </Typography>
              <Box sx={{ height: 200 }}>
                <FileUploader
                  onFileAccepted={handleQuestionImageUpload}
                  onError={handleQuestionImageError}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg'],
                  }}
                  maxSize={5242880} // 5MB
                  title="Arrastra una imagen aquí, o haz clic para seleccionar"
                  icon={<EditIcon />}
                  error={error}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Layout
              </Typography>
              <Select
                fullWidth
                value={data.layout || 'horizontal'}
                onChange={(e) => handleLayoutChange(e.target.value as 'horizontal' | 'vertical')}
              >
                <MenuItem value="horizontal">Horizontal (2 columnas)</MenuItem>
                <MenuItem value="vertical">Vertical (1 columna)</MenuItem>
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Opciones de respuesta
              </Typography>
              <Box sx={{ height: 200 }}>
                <FileUploader
                  onFileAccepted={handleOptionImageUpload}
                  onError={handleOptionImageError}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg'],
                  }}
                  maxSize={5242880} // 5MB
                  title="Arrastra las imágenes de las opciones aquí"
                  icon={<EditIcon />}
                  error={error}
                />
              </Box>

              <RadioGroup
                value={data.options.find(opt => opt.isCorrect)?.id || ''}
                onChange={(e) => handleCorrectOptionChange(e.target.value)}
              >
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {data.options.map((option) => (
                    <Box
                      key={option.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                      }}
                    >
                      <Box
                        component="img"
                        src={option.imageUrl}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'contain',
                          borderRadius: 1,
                        }}
                      />
                      <FormControlLabel
                        value={option.id}
                        control={<Radio />}
                        label="Respuesta correcta"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteOption(option.id)}
                        sx={{ ml: 'auto' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Imágenes de feedback
              </Typography>
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Respuesta correcta
                  </Typography>
                  <Box sx={{ height: 150 }}>
                    <FileUploader
                      onFileAccepted={(file) => handleFeedbackImageUpload(file, 'correct')}
                      onError={handleFeedbackImageError}
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg'],
                      }}
                      maxSize={5242880} // 5MB
                      title="Imagen para respuesta correcta"
                      icon={<EditIcon />}
                      error={error}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Respuesta incorrecta
                  </Typography>
                  <Box sx={{ height: 150 }}>
                    <FileUploader
                      onFileAccepted={(file) => handleFeedbackImageUpload(file, 'incorrect')}
                      onError={handleFeedbackImageError}
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg'],
                      }}
                      maxSize={5242880} // 5MB
                      title="Imagen para respuesta incorrecta"
                      icon={<EditIcon />}
                      error={error}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Escala y Colores
              </Typography>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption">Escala</Typography>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={style.scale}
                    onChange={(e) => handleStyleChange('scale', parseFloat(e.target.value))}
                    style={{ width: '100%', height: 32 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption">Color de fondo</Typography>
                  <input
                    type="color"
                    value={style.backgroundColor}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    style={{ width: '100%', height: 32 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption">Color de selección</Typography>
                  <input
                    type="color"
                    value={style.selectedColor}
                    onChange={(e) => handleStyleChange('selectedColor', e.target.value)}
                    style={{ width: '100%', height: 32 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption">Color de respuesta correcta</Typography>
                  <input
                    type="color"
                    value={style.correctColor}
                    onChange={(e) => handleStyleChange('correctColor', e.target.value)}
                    style={{ width: '100%', height: 32 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption">Color de respuesta incorrecta</Typography>
                  <input
                    type="color"
                    value={style.incorrectColor}
                    onChange={(e) => handleStyleChange('incorrectColor', e.target.value)}
                    style={{ width: '100%', height: 32 }}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TriviaElement; 
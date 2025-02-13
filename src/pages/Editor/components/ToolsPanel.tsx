import React, { useState } from 'react';
import { Stack, IconButton, Tooltip, Divider } from '@mui/material';
import {
  SmartButton as ButtonIcon,
  ViewCarousel as CarouselIcon,
  QuestionAnswer as TriviaIcon,
  QrCode as QrIcon,
  List as ChoiceIcon,
  Collections as GalleryIcon,
  Upload as UploadIcon,
  VideoCall as VideoIcon,
  Image as ImageIcon,
  TextFields as TextIcon,
} from '@mui/icons-material';
import { useEditorStore } from '../../../stores/editorStore';
import useProjectStore from '../../../stores/projectStore';
import type { ElementType } from '../../../stores/editorStore';
import VideoUploader from '../../../components/common/VideoUploader';
import { ExportDialog } from '../../../components/export/ExportDialog';

const tools: { type: Exclude<ElementType, 'video'>; icon: React.ComponentType; tooltip: string }[] = [
  { type: 'button', icon: ButtonIcon, tooltip: 'Añadir Botón' },
  { type: 'carousel', icon: CarouselIcon, tooltip: 'Añadir Carousel' },
  { type: 'gallery', icon: GalleryIcon, tooltip: 'Añadir Galería' },
  { type: 'trivia', icon: TriviaIcon, tooltip: 'Añadir Trivia' },
  { type: 'qr', icon: QrIcon, tooltip: 'Añadir Código QR' },
  { type: 'choice', icon: ChoiceIcon, tooltip: 'Añadir Choice' },
];

const defaultContent = {
  button: {
    image: '',
    url: '',
    style: {
      scale: 1,
      position: { x: 50, y: 50 },
    },
  },
  carousel: {
    images: [],
    style: {
      scale: 1,
      position: { x: 50, y: 50 },
    },
  },
  gallery: {
    media: [],
    currentIndex: 0,
    style: {
      scale: 1,
      position: { x: 50, y: 50 },
    },
  },
  trivia: {
    questionImage: '',
    options: [],
    layout: 'horizontal',
    feedbackImages: {
      correct: '',
      incorrect: '',
    },
    style: {
      scale: 1,
      backgroundColor: '#2196f3',
      selectedColor: '#64b5f6',
      correctColor: '#4caf50',
      incorrectColor: '#f44336',
    },
    selectedOption: null,
    showResult: false,
  },
  qr: {
    url: '',
    type: 'web'
  },
  choice: {
    options: [],
    redirectUrl: '',
    selectedOption: null,
  },
} as const;

const ToolsPanel: React.FC = () => {
  const addElement = useEditorStore((state) => state.addElement);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleAddElement = (type: Exclude<ElementType, 'video'>) => {
    addElement(type, defaultContent[type]);
  };

  return (
    <>
      <Stack spacing={1}>
        <VideoUploader />
        {tools.map(({ type, icon: Icon, tooltip }) => (
          <Tooltip key={type} title={tooltip} placement="right">
            <IconButton
              onClick={() => handleAddElement(type)}
              sx={{
                width: '44px',
                height: '44px',
              }}
            >
              <Icon />
            </IconButton>
          </Tooltip>
        ))}
        <Divider sx={{ my: 1 }} />
        <Tooltip title="Exportar" placement="right">
          <IconButton onClick={() => setExportDialogOpen(true)}>
            <UploadIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      />
    </>
  );
};

export default ToolsPanel; 
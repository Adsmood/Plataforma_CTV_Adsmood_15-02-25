import React, { useState } from 'react';
import { Stack, IconButton, Tooltip, Divider } from '@mui/material';
import {
  SmartButton as ButtonIcon,
  ViewCarousel as CarouselIcon,
  QuestionAnswer as TriviaIcon,
  QrCode as QrIcon,
  List as ChoiceIcon,
  Collections as GalleryIcon,
  Download as ExportIcon,
  VideoCall as VideoIcon,
  Image as ImageIcon,
  TextFields as TextIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useEditorStore } from '../../../stores/editorStore';
import useProjectStore from '../../../stores/projectStore';
import type { ElementType } from '../../../stores/editorStore';
import VideoUploader from '../../../components/common/VideoUploader';
import { generateVastXml, downloadVastXml } from '../../../services/vastExporter';
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
  const editorState = useEditorStore((state) => ({
    elements: state.elements,
    background: state.background,
    timeline: state.timeline
  }));
  const currentProject = useProjectStore((state) => state.currentProject);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleAddElement = (type: Exclude<ElementType, 'video'>) => {
    addElement(type, defaultContent[type]);
  };

  const handleExportVast = () => {
    if (!currentProject) {
      alert('Por favor, guarda el proyecto antes de exportar el VAST');
      return;
    }

    const options = {
      baseUrl: window.location.origin,
      impressionUrl: `${window.location.origin}/track/impression`,
      clickTrackingUrl: `${window.location.origin}/track/click`,
      startTrackingUrl: `${window.location.origin}/track/start`,
      completeTrackingUrl: `${window.location.origin}/track/complete`,
      skipTrackingUrl: `${window.location.origin}/track/skip`,
      interactionTrackingUrl: `${window.location.origin}/track/interaction`,
      viewableImpressionUrl: `${window.location.origin}/track/viewable`,
      quartileTrackingUrls: {
        firstQuartile: `${window.location.origin}/track/firstQuartile`,
        midpoint: `${window.location.origin}/track/midpoint`,
        thirdQuartile: `${window.location.origin}/track/thirdQuartile`,
      },
      videoFormats: [
        {
          url: editorState.background?.url || '',
          codec: 'H.264' as const,
          bitrate: 2000,
          width: 1920,
          height: 1080,
          delivery: 'progressive' as const
        }
      ],
      fallbackVideoUrl: editorState.background?.url || '',
      platform: 'roku' as const
    };

    const vastXml = generateVastXml(editorState, options);
    downloadVastXml(vastXml, currentProject.name);
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
        <Tooltip title="Exportar VAST" placement="right">
          <IconButton
            onClick={handleExportVast}
            sx={{
              width: '44px',
              height: '44px',
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <ExportIcon />
          </IconButton>
        </Tooltip>
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
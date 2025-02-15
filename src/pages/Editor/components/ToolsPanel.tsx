import React from 'react';
import styled from 'styled-components';
import {
  SmartButton as ButtonIcon,
  ViewCarousel as CarouselIcon,
  QuestionAnswer as TriviaIcon,
  QrCode as QrIcon,
  List as ChoiceIcon,
  Collections as GalleryIcon,
  Download as ExportIcon,
  Mouse as SelectIcon
} from '@mui/icons-material';
import { useEditorStore } from '../../../stores/editorStore';
import type { ElementType } from '../../../stores/editorStore';

const tools: { type: ElementType; icon: React.ComponentType; tooltip: string }[] = [
  { type: 'select', icon: SelectIcon, tooltip: 'Seleccionar' },
  { type: 'button', icon: ButtonIcon, tooltip: 'Añadir Botón' },
  { type: 'carousel', icon: CarouselIcon, tooltip: 'Añadir Carousel' },
  { type: 'gallery', icon: GalleryIcon, tooltip: 'Añadir Galería' },
  { type: 'trivia', icon: TriviaIcon, tooltip: 'Añadir Trivia' },
  { type: 'qr', icon: QrIcon, tooltip: 'Añadir Código QR' },
  { type: 'choice', icon: ChoiceIcon, tooltip: 'Añadir Choice' },
];

const defaultContent = {
  button: {
    text: 'Nuevo Botón',
    url: '',
    style: {
      backgroundColor: '#2196f3',
      color: '#ffffff',
      borderRadius: '4px',
      padding: '8px 16px',
    }
  },
  carousel: {
    items: [],
    style: {
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      padding: '16px',
    }
  },
  gallery: {
    images: [],
    style: {
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      padding: '16px',
    }
  },
  trivia: {
    question: '¿Nueva pregunta?',
    options: ['Opción 1', 'Opción 2', 'Opción 3'],
    correctOption: 0,
    style: {
      backgroundColor: '#2196f3',
      color: '#ffffff',
      borderRadius: '4px',
      padding: '16px',
    }
  },
  qr: {
    url: 'https://example.com',
    style: {
      backgroundColor: '#ffffff',
      padding: '16px',
    }
  },
  choice: {
    options: ['Opción 1', 'Opción 2', 'Opción 3'],
    style: {
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      padding: '16px',
    }
  },
  select: {},
  video: {}
} as const;

const ToolButton = styled.button<{ active?: boolean }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  color: ${({ active, theme }) => (active ? theme.colors.backgroundWhite : theme.colors.textPrimary)};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ active, theme }) => (active ? theme.colors.primaryDark : theme.colors.backgroundLight)};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
`;

const ToolGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

interface ToolsPanelProps {
  onShowAnalytics?: () => void;
  onExport?: () => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({ onShowAnalytics, onExport }) => {
  const [selectedTool, setSelectedTool] = React.useState<ElementType>('select');
  const addElement = useEditorStore((state) => state.addElement);

  const handleToolClick = (type: ElementType) => {
    setSelectedTool(type);
    if (type !== 'select') {
      addElement(type, defaultContent[type]);
    }
  };

  return (
    <Container>
      <ToolGroup>
        {tools.map(({ type, icon: Icon, tooltip }) => (
          <ToolButton
            key={type}
            active={selectedTool === type}
            onClick={() => handleToolClick(type)}
            title={tooltip}
          >
            <Icon />
          </ToolButton>
        ))}
      </ToolGroup>

      <ToolGroup>
        <ToolButton
          onClick={onExport}
          title="Exportar"
        >
          <ExportIcon />
        </ToolButton>
      </ToolGroup>
    </Container>
  );
};

export default ToolsPanel; 
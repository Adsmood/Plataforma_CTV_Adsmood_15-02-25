import React from 'react';
import styled from 'styled-components';
import { 
  Button,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  TextFields,
  Image,
  Movie,
  MusicNote,
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
} from '@mui/icons-material';
import { useEditorStore, ElementType } from '../../stores/editorStore';

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
`;

const ToolButton = styled(Button)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  height: auto;
  text-transform: none;
`;

const ElementTools = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tools: React.FC = () => {
  const {
    addElement,
    removeElement,
    selectedElement,
    elements,
    setElementVisibility,
  } = useEditorStore();

  const selectedElementData = elements.find(el => el.id === selectedElement);

  const handleAddElement = (type: ElementType) => {
    const content = type === 'text' ? { text: 'Nuevo texto' } :
                   type === 'image' ? { url: '' } :
                   type === 'video' ? { url: '' } :
                   type === 'audio' ? { url: '' } : {};
    
    addElement(type, content);
  };

  const handleDuplicate = () => {
    if (!selectedElementData) return;

    addElement(
      selectedElementData.type,
      { ...selectedElementData.content }
    );
  };

  const handleToggleVisibility = () => {
    if (!selectedElement) return;
    setElementVisibility(selectedElement, !selectedElementData?.isVisible);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Agregar elementos
      </Typography>
      
      <ToolsGrid>
        <ToolButton
          variant="outlined"
          onClick={() => handleAddElement('text')}
        >
          <TextFields />
          Texto
        </ToolButton>

        <ToolButton
          variant="outlined"
          onClick={() => handleAddElement('image')}
        >
          <Image />
          Imagen
        </ToolButton>

        <ToolButton
          variant="outlined"
          onClick={() => handleAddElement('video')}
        >
          <Movie />
          Video
        </ToolButton>

        <ToolButton
          variant="outlined"
          onClick={() => handleAddElement('audio')}
        >
          <MusicNote />
          Audio
        </ToolButton>
      </ToolsGrid>

      {selectedElement && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Elemento seleccionado
          </Typography>

          <ElementTools>
            <Tooltip title="Duplicar elemento">
              <IconButton onClick={handleDuplicate}>
                <DuplicateIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={selectedElementData?.isVisible ? 'Ocultar' : 'Mostrar'}>
              <IconButton onClick={handleToggleVisibility}>
                {selectedElementData?.isVisible ? <HideIcon /> : <ShowIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar elemento">
              <IconButton
                onClick={() => selectedElement && removeElement(selectedElement)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </ElementTools>
        </>
      )}
    </Box>
  );
};

export default Tools; 
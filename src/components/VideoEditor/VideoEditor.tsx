import React, { useState } from 'react';
import styled from 'styled-components';
import { Paper, Box, Typography, Divider, Dialog, Tab, Tabs } from '@mui/material';
import VideoPreview from './VideoPreview';
import Timeline from './Timeline';
import ExportPanel from './ExportPanel';
import KeyframeEditor from './KeyframeEditor';
import ElementRenderer from './ElementRenderer';
import Tools from './Tools';
import { useEditorStore } from '../../stores/editorStore';
import { Keyframe } from '../../types/timeline';

const EditorContainer = styled(Paper)`
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  padding: 16px;
  height: 100%;
  background: ${props => props.theme.colors.background.paper};
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: ${props => props.theme.colors.background.dark};
  border-radius: 8px;
  overflow: hidden;
`;

const ElementsLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const ToolsContainer = styled(Box)`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

interface VideoEditorProps {
  videoUrl: string;
  onVideoChange?: (duration: number) => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({
  videoUrl,
  onVideoChange,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const {
    elements,
    selectedElement,
    updateElement,
    updateTimeline,
  } = useEditorStore();

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    updateTimeline({ currentTime: time });
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    onVideoChange?.(newDuration);
    updateTimeline({ duration: newDuration });
  };

  const handleKeyframeChange = (trackId: string, keyframeId: string, changes: Partial<Keyframe>) => {
    if (!selectedElement) return;
    
    const element = elements.find(el => el.id === selectedElement);
    if (!element) return;

    const track = element.keyframes.find(t => t.property === trackId);
    if (!track) return;

    const updatedKeyframes = track.keyframes.map((kf, index) =>
      index.toString() === keyframeId ? { ...kf, ...changes } : kf
    );

    const updatedTracks = element.keyframes.map(t =>
      t.property === trackId ? { ...t, keyframes: updatedKeyframes } : t
    );

    updateElement(selectedElement, { keyframes: updatedTracks });
  };

  const handleKeyframeAdd = (trackId: string, keyframe: Keyframe) => {
    if (!selectedElement) return;
    
    const element = elements.find(el => el.id === selectedElement);
    if (!element) return;

    const track = element.keyframes.find(t => t.property === trackId);
    if (!track) return;

    const updatedTracks = element.keyframes.map(t =>
      t.property === trackId
        ? { ...t, keyframes: [...t.keyframes, keyframe].sort((a, b) => a.time - b.time) }
        : t
    );

    updateElement(selectedElement, { keyframes: updatedTracks });
  };

  const handleKeyframeDelete = (trackId: string, keyframeId: string) => {
    if (!selectedElement) return;
    
    const element = elements.find(el => el.id === selectedElement);
    if (!element) return;

    const track = element.keyframes.find(t => t.property === trackId);
    if (!track) return;

    const updatedTracks = element.keyframes.map(t =>
      t.property === trackId
        ? { ...t, keyframes: t.keyframes.filter((_, i) => i.toString() !== keyframeId) }
        : t
    );

    updateElement(selectedElement, { keyframes: updatedTracks });
  };

  return (
    <EditorContainer>
      <Box>
        <Typography variant="h6" gutterBottom>
          Editor de Video
        </Typography>
        <PreviewContainer>
          <VideoPreview
            url={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onDuration={handleDurationChange}
          />
          <ElementsLayer>
            {elements.map(element => (
              <ElementRenderer
                key={element.id}
                element={element}
                currentTime={currentTime}
              />
            ))}
          </ElementsLayer>
        </PreviewContainer>
      </Box>
      
      <Box>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Herramientas" />
          <Tab label="Animación" disabled={!selectedElement} />
        </Tabs>

        <Box mt={2}>
          {selectedTab === 0 ? (
            <Tools />
          ) : (
            selectedElement && (
              <KeyframeEditor
                element={elements.find(el => el.id === selectedElement)!}
                onKeyframeChange={handleKeyframeChange}
                onKeyframeAdd={handleKeyframeAdd}
                onKeyframeDelete={handleKeyframeDelete}
              />
            )
          )}
        </Box>
      </Box>

      <Divider />
      
      <Box>
        <Timeline
          elements={elements}
          duration={duration}
          currentTime={currentTime}
          onTimeUpdate={handleTimeUpdate}
          onElementChange={updateElement}
          onElementSelect={(id) => useEditorStore.getState().setSelectedElement(id)}
          selectedElementId={selectedElement}
        />
      </Box>

      <Dialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <ExportPanel onExport={async (config) => {
          try {
            // Aquí implementaremos la lógica de exportación
            console.log('Configuración de exportación:', config);
            
            // 1. Recopilar datos del video y elementos
            const exportData = {
              video: {
                url: videoUrl,
                duration,
              },
              elements: elements.map(element => ({
                ...element,
                // Asegurarnos de que los tiempos están dentro de la duración del video
                startTime: Math.min(element.startTime, duration),
                duration: Math.min(element.duration, duration - element.startTime),
              })),
              config,
            };

            // 2. Enviar al servicio de exportación
            const response = await fetch('/api/export', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(exportData),
            });

            if (!response.ok) {
              throw new Error('Error al exportar el video');
            }

            const result = await response.json();
            console.log('Resultado de la exportación:', result);

            // 3. Cerrar el diálogo
            setShowExportDialog(false);
          } catch (error) {
            console.error('Error en la exportación:', error);
            // Aquí deberíamos mostrar un mensaje de error al usuario
          }
        }} />
      </Dialog>
    </EditorContainer>
  );
};

export default VideoEditor; 
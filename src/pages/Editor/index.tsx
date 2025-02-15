import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, Stack } from '@mui/material';
import ToolsPanel from './components/ToolsPanel';
import Canvas from './components/Canvas';
import LayersPanel from './components/LayersPanel';
import Timeline from './components/Timeline';
import ProjectManager from './components/ProjectManager';
import { ElementControls } from './components/ElementControls';
import { AnalyticsDashboard } from '../../components/Analytics';
import { useEditorStore } from '../../stores/editorStore';
import { useProjectStore } from '../../stores/projectStore';

const Container = styled.div`
    display: grid;
    grid-template-columns: 64px 1fr 300px;
    grid-template-rows: 1fr 200px;
    height: 100vh;
    background-color: #f5f5f5;
`;

const MainArea = styled.div`
    grid-column: 2;
    grid-row: 1;
    position: relative;
    overflow: hidden;
`;

const RightPanel = styled.div`
    grid-column: 3;
    grid-row: 1 / span 2;
    background-color: white;
    border-left: 1px solid #e0e0e0;
    overflow-y: auto;
`;

const TimelineArea = styled.div`
    grid-column: 1 / span 2;
    grid-row: 2;
    background-color: white;
    border-top: 1px solid #e0e0e0;
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    
    &:hover {
        color: #333;
    }
`;

const Editor: React.FC = () => {
    const [showAnalytics, setShowAnalytics] = useState(false);
    const selectedElement = useEditorStore(state => state.selectedElement);
    const project = useProjectStore(state => state.currentProject);

    const handleShowAnalytics = () => {
        setShowAnalytics(true);
    };

    const handleCloseAnalytics = () => {
        setShowAnalytics(false);
    };

    const handleAnalyticsError = (error: Error) => {
        console.error('Error en análisis:', error);
        // TODO: Implementar sistema de notificaciones
        alert('Error al cargar los datos de análisis: ' + error.message);
    };

    return (
        <Container>
            <Box className="tools-panel">
                <Stack spacing={2} alignItems="center">
                    <ProjectManager />
                    <ToolsPanel
                        onShowAnalytics={handleShowAnalytics}
                        onExport={() => {/* TODO: Implementar exportación */}}
                    />
                </Stack>
            </Box>
            <MainArea>
                <Canvas />
            </MainArea>
            <RightPanel>
                {selectedElement && <ElementControls element={selectedElement} />}
                <LayersPanel />
            </RightPanel>
            <TimelineArea>
                <Timeline />
            </TimelineArea>
            {showAnalytics && (
                <Modal>
                    <ModalContent>
                        <CloseButton onClick={handleCloseAnalytics}>
                            ×
                        </CloseButton>
                        <AnalyticsDashboard
                            creativeId={project?.id || ''}
                            onError={handleAnalyticsError}
                        />
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default Editor; 
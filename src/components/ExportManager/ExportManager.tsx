import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ExportPlatforms } from '../ExportPlatforms/ExportPlatforms';
import { PlatformSpec } from '../../types/platforms';
import { exportService } from '../../services/exportService';

interface ExportManagerProps {
    videoUrl: string;
    campaignId: string;
    advertiserId: string;
    interactiveData?: {
        overlayUrl?: string;
        clickThroughUrl: string;
        customParams?: Record<string, string>;
    };
    onExportComplete?: (result: { vastUrl: string }) => void;
    onError?: (error: Error) => void;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const StatusContainer = styled.div<{ status: 'processing' | 'error' | 'success' }>`
    padding: 16px;
    border-radius: 8px;
    background-color: ${props => {
        switch (props.status) {
            case 'processing':
                return '#fff8e1';
            case 'error':
                return '#ffebee';
            case 'success':
                return '#e8f5e9';
            default:
                return '#fff';
        }
    }};
    border: 1px solid ${props => {
        switch (props.status) {
            case 'processing':
                return '#ffd54f';
            case 'error':
                return '#ef5350';
            case 'success':
                return '#66bb6a';
            default:
                return '#ddd';
        }
    }};
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 8px;
`;

const ProgressFill = styled.div<{ progress: number }>`
    width: ${props => props.progress}%;
    height: 100%;
    background-color: #4a90e2;
    transition: width 0.3s ease;
`;

export const ExportManager: React.FC<ExportManagerProps> = ({
    videoUrl,
    campaignId,
    advertiserId,
    interactiveData,
    onExportComplete,
    onError
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportId, setExportId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'processing' | 'error' | 'success'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleExport = useCallback(async (platforms: PlatformSpec[]) => {
        setIsExporting(true);
        setStatus('processing');
        setErrorMessage(null);

        try {
            // Primero validamos la configuración
            const validation = await exportService.validateExportSettings({
                videoUrl,
                platforms,
                campaignId,
                advertiserId,
                interactiveData
            });

            if (!validation.isValid) {
                const errorMsg = validation.errors
                    .map(err => `${err.platform}: ${err.issues.join(', ')}`)
                    .join('\n');
                throw new Error(`Errores de validación:\n${errorMsg}`);
            }

            // Iniciamos la exportación
            const result = await exportService.exportForPlatforms({
                videoUrl,
                platforms,
                campaignId,
                advertiserId,
                interactiveData
            });

            setExportId(result.vastUrl.split('/').pop() || null);
            
            // Iniciamos el polling del estado
            const checkStatus = async () => {
                if (!exportId) return;
                
                const statusResult = await exportService.checkExportStatus(exportId);
                setExportProgress(statusResult.progress);

                if (statusResult.status === 'completed') {
                    setStatus('success');
                    setIsExporting(false);
                    onExportComplete?.({ vastUrl: statusResult.result!.vastUrl });
                } else if (statusResult.status === 'failed') {
                    throw new Error(statusResult.error || 'Error en la exportación');
                } else {
                    setTimeout(checkStatus, 2000); // Polling cada 2 segundos
                }
            };

            checkStatus();
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
            setIsExporting(false);
            onError?.(error instanceof Error ? error : new Error('Error desconocido'));
        }
    }, [videoUrl, campaignId, advertiserId, interactiveData, exportId, onExportComplete, onError]);

    return (
        <Container>
            <ExportPlatforms
                onExport={handleExport}
                isExporting={isExporting}
            />

            {status !== 'idle' && (
                <StatusContainer status={status as any}>
                    {status === 'processing' && (
                        <>
                            <div>Exportando video para las plataformas seleccionadas...</div>
                            <ProgressBar>
                                <ProgressFill progress={exportProgress} />
                            </ProgressBar>
                        </>
                    )}
                    {status === 'error' && (
                        <div style={{ color: '#c62828' }}>
                            {errorMessage || 'Error en la exportación'}
                        </div>
                    )}
                    {status === 'success' && (
                        <div style={{ color: '#2e7d32' }}>
                            Exportación completada exitosamente
                        </div>
                    )}
                </StatusContainer>
            )}
        </Container>
    );
}; 
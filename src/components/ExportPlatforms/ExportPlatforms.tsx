import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { CTV_PLATFORMS, PlatformSpec } from '../../types/platforms';

interface ExportPlatformsProps {
    onExport: (platforms: PlatformSpec[]) => Promise<void>;
    isExporting?: boolean;
}

const Container = styled.div`
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 18px;
    color: #333;
`;

const PlatformGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
`;

const PlatformCard = styled.div<{ selected: boolean }>`
    padding: 16px;
    border: 2px solid ${props => props.selected ? '#4a90e2' : '#e0e0e0'};
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${props => props.selected ? '#f5f9ff' : '#fff'};

    &:hover {
        border-color: #4a90e2;
        transform: translateY(-2px);
    }
`;

const PlatformName = styled.h3`
    margin: 0 0 8px;
    font-size: 16px;
    color: #333;
`;

const PlatformSpecs = styled.div`
    font-size: 12px;
    color: #666;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`;

const Button = styled.button<{ primary?: boolean }>`
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
    background-color: ${props => props.primary ? '#4a90e2' : '#f5f5f5'};
    color: ${props => props.primary ? '#fff' : '#333'};

    &:hover {
        background-color: ${props => props.primary ? '#357abd' : '#e0e0e0'};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ExportPlatforms: React.FC<ExportPlatformsProps> = ({
    onExport,
    isExporting = false
}) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());

    const togglePlatform = useCallback((platformId: string) => {
        setSelectedPlatforms(prev => {
            const next = new Set(prev);
            if (next.has(platformId)) {
                next.delete(platformId);
            } else {
                next.add(platformId);
            }
            return next;
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        setSelectedPlatforms(new Set(Object.keys(CTV_PLATFORMS)));
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedPlatforms(new Set());
    }, []);

    const handleExport = useCallback(async () => {
        const selectedPlatformSpecs = Array.from(selectedPlatforms)
            .map(id => CTV_PLATFORMS[id])
            .filter(Boolean);
        
        if (selectedPlatformSpecs.length > 0) {
            await onExport(selectedPlatformSpecs);
        }
    }, [selectedPlatforms, onExport]);

    return (
        <Container>
            <Header>
                <Title>Exportar para Plataformas CTV</Title>
                <ActionButtons>
                    <Button onClick={handleSelectAll}>
                        Seleccionar Todas
                    </Button>
                    <Button onClick={handleClearSelection}>
                        Limpiar Selección
                    </Button>
                </ActionButtons>
            </Header>

            <PlatformGrid>
                {Object.values(CTV_PLATFORMS).map(platform => (
                    <PlatformCard
                        key={platform.id}
                        selected={selectedPlatforms.has(platform.id)}
                        onClick={() => togglePlatform(platform.id)}
                    >
                        <PlatformName>{platform.name}</PlatformName>
                        <PlatformSpecs>
                            <div>VAST {platform.vastVersion}</div>
                            <div>
                                {platform.videoFormats.map(format => 
                                    `${format.resolution} ${format.codec.toUpperCase()}`
                                ).join(', ')}
                            </div>
                            <div>
                                {platform.interactivitySupport ? '✓ Interactividad' : '✗ Sin interactividad'}
                            </div>
                        </PlatformSpecs>
                    </PlatformCard>
                ))}
            </PlatformGrid>

            <ActionButtons>
                <Button
                    primary
                    disabled={selectedPlatforms.size === 0 || isExporting}
                    onClick={handleExport}
                >
                    {isExporting ? 'Exportando...' : 'Exportar Seleccionadas'}
                </Button>
            </ActionButtons>
        </Container>
    );
}; 
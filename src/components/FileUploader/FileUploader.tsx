import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { assetService } from '../../services/assetService';
import { useAssetStore } from '../../stores/assetStore';

interface FileUploaderProps {
    onUploadComplete?: (fileUrl: string) => void;
    onUploadError?: (error: Error) => void;
    accept?: string;
    maxSize?: number;
}

const Container = styled.div`
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
`;

const UploadButton = styled.label<{ isUploading: boolean }>`
    display: block;
    padding: 12px 24px;
    background-color: ${props => props.isUploading ? '#f5f5f5' : '#4a90e2'};
    color: ${props => props.isUploading ? '#333' : 'white'};
    border-radius: 4px;
    cursor: ${props => props.isUploading ? 'not-allowed' : 'pointer'};
    text-align: center;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => props.isUploading ? '#f5f5f5' : '#357abd'};
    }
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    height: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
    height: 100%;
    width: ${props => props.progress}%;
    background-color: #4a90e2;
    transition: width 0.3s ease;
`;

const ProgressText = styled.span`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #333;
    font-size: 12px;
`;

export const FileUploader: React.FC<FileUploaderProps> = ({
    onUploadComplete,
    onUploadError,
    accept = 'video/mp4,video/quicktime,image/jpeg,image/png,image/gif',
    maxSize = 500 * 1024 * 1024 // 500MB
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const addAsset = useAssetStore(state => state.addAsset);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > maxSize) {
            onUploadError?.(new Error(`El archivo excede el tamaño máximo de ${maxSize / 1024 / 1024}MB`));
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            const response = await assetService.uploadFile(file);
            addAsset({
                url: response.file.url,
                type: file.type.startsWith('video/') ? 'video' : 'image',
                originalName: file.name,
                size: file.size
            });
            onUploadComplete?.(response.file.url);
        } catch (error) {
            onUploadError?.(error as Error);
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    }, [maxSize, onUploadComplete, onUploadError, addAsset]);

    return (
        <Container>
            <input
                type="file"
                onChange={handleFileChange}
                accept={accept}
                disabled={isUploading}
                style={{ display: 'none' }}
                id="file-input"
            />
            <UploadButton 
                htmlFor="file-input"
                isUploading={isUploading}
            >
                {isUploading ? (
                    <ProgressBarContainer>
                        <ProgressBarFill progress={progress} />
                        <ProgressText>{progress}%</ProgressText>
                    </ProgressBarContainer>
                ) : (
                    'Seleccionar archivo'
                )}
            </UploadButton>
        </Container>
    );
}; 
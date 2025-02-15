import { PlatformSpec } from '../types/platforms';
import { assetService } from './assetService';

interface ExportOptions {
    videoUrl: string;
    platforms: PlatformSpec[];
    campaignId: string;
    advertiserId: string;
    interactiveData?: {
        overlayUrl?: string;
        clickThroughUrl: string;
        customParams?: Record<string, string>;
    };
}

interface ExportResult {
    vastUrl: string;
    videoVariants: {
        platform: string;
        url: string;
        format: {
            codec: string;
            resolution: string;
            fps: number;
            bitrate: number;
        };
    }[];
}

class ExportService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL || 'https://adsmood-ctv-api.onrender.com';
    }

    async exportForPlatforms(options: ExportOptions): Promise<ExportResult> {
        try {
            const response = await fetch(`${this.baseUrl}/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sourceVideo: options.videoUrl,
                    platforms: options.platforms.map(p => p.id),
                    campaignId: options.campaignId,
                    advertiserId: options.advertiserId,
                    interactiveData: options.interactiveData
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error en la exportación');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en exportForPlatforms:', error);
            throw error;
        }
    }

    async checkExportStatus(exportId: string): Promise<{
        status: 'processing' | 'completed' | 'failed';
        progress: number;
        result?: ExportResult;
        error?: string;
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/export/${exportId}/status`);
            if (!response.ok) {
                throw new Error('Error al verificar el estado de la exportación');
            }
            return await response.json();
        } catch (error) {
            console.error('Error en checkExportStatus:', error);
            throw error;
        }
    }

    getVastPreviewUrl(exportId: string, platform: string): string {
        return `${this.baseUrl}/vast/${exportId}/preview?platform=${platform}`;
    }

    async validateExportSettings(options: ExportOptions): Promise<{
        isValid: boolean;
        errors: {
            platform: string;
            issues: string[];
        }[];
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/export/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(options),
            });

            if (!response.ok) {
                throw new Error('Error al validar la configuración de exportación');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en validateExportSettings:', error);
            throw error;
        }
    }
}

export const exportService = new ExportService(); 
interface UploadResponse {
    message: string;
    file: {
        originalName: string;
        filename: string;
        size: number;
        url: string;
    };
}

class AssetService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_ASSETS_URL || 'https://adsmood-ctv-assets.onrender.com';
    }

    async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.baseUrl}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al subir el archivo');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en uploadFile:', error);
            throw error;
        }
    }

    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            const data = await response.json();
            return data.status === 'ok';
        } catch (error) {
            console.error('Error en checkHealth:', error);
            return false;
        }
    }

    getAssetUrl(filename: string): string {
        return `${this.baseUrl}/files/${filename}`;
    }
}

export const assetService = new AssetService(); 
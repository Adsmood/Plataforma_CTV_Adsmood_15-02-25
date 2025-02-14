import { InteractionType, OverlayType } from '../modules/interactive/dto/interactive.dto';

interface ApiConfig {
  baseUrl: string;
  assetsUrl: string;
}

class ApiService {
  private config: ApiConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      assetsUrl: process.env.REACT_APP_ASSETS_URL || 'https://adsmood-ctv-assets.onrender.com',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `Error en la petición (${response.status}: ${response.statusText})`
      );
    }
    return response.json();
  }

  async createInteraction(adId: string, data: any) {
    const response = await fetch(`${this.config.baseUrl}/interactive/${adId}/interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateInteraction(adId: string, interactionId: string, data: any) {
    const response = await fetch(
      `${this.config.baseUrl}/interactive/${adId}/interactions/${interactionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse(response);
  }

  async deleteInteraction(adId: string, interactionId: string) {
    const response = await fetch(
      `${this.config.baseUrl}/interactive/${adId}/interactions/${interactionId}`,
      {
        method: 'DELETE',
      }
    );
    return this.handleResponse(response);
  }

  async getInteractions(adId: string) {
    const response = await fetch(`${this.config.baseUrl}/interactive/${adId}/interactions`);
    return this.handleResponse(response);
  }

  async createOverlay(adId: string, data: any) {
    const response = await fetch(`${this.config.baseUrl}/interactive/${adId}/overlays`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateOverlay(adId: string, overlayId: string, data: any) {
    const response = await fetch(
      `${this.config.baseUrl}/interactive/${adId}/overlays/${overlayId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse(response);
  }

  async deleteOverlay(adId: string, overlayId: string) {
    const response = await fetch(
      `${this.config.baseUrl}/interactive/${adId}/overlays/${overlayId}`,
      {
        method: 'DELETE',
      }
    );
    return this.handleResponse(response);
  }

  async getOverlays(adId: string) {
    const response = await fetch(`${this.config.baseUrl}/interactive/${adId}/overlays`);
    return this.handleResponse(response);
  }

  async getInteractiveData(adId: string) {
    const response = await fetch(`${this.config.baseUrl}/interactive/${adId}`);
    return this.handleResponse(response);
  }

  async uploadAsset(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.config.assetsUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await this.handleResponse<{ success: boolean; url: string }>(response);
    
    if (result.success && result.url) {
      return {
        success: true,
        url: `${this.config.assetsUrl}${result.url}`,
      };
    }

    throw new Error('Error al subir el archivo');
  }

  async generateVast(adId: string) {
    const response = await fetch(`${this.config.baseUrl}/interactive/${adId}/vast`);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService(); 
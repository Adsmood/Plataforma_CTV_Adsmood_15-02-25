interface AnalyticsData {
    impressions: number;
    uniqueDevices: number;
    completionRate: number;
    interactionRate: number;
    avgWatchTime: number;
    events: Record<string, number>;
    interactions: Record<string, number>;
}

interface TimelineEvent {
    type: string;
    timestamp: Date;
    platform: string;
    progress?: number;
    deviceType?: string;
    country?: string;
}

interface TimelineInteraction {
    type: string;
    timestamp: Date;
    platform: string;
    metadata?: any;
    deviceType?: string;
    country?: string;
}

interface PlatformStats {
    platform: string;
    impressions: number;
    uniqueDevices: number;
}

class AnalyticsService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL || 'https://adsmood-ctv-api.onrender.com';
    }

    async getStats(creativeId: string, dateRange?: { startDate?: Date; endDate?: Date }): Promise<AnalyticsData> {
        try {
            const params = new URLSearchParams();
            if (dateRange?.startDate) {
                params.append('startDate', dateRange.startDate.toISOString());
            }
            if (dateRange?.endDate) {
                params.append('endDate', dateRange.endDate.toISOString());
            }

            const response = await fetch(`${this.baseUrl}/analytics/${creativeId}/stats?${params}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al obtener estadísticas');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getStats:', error);
            throw error;
        }
    }

    async getEvents(creativeId: string, dateRange?: { startDate?: Date; endDate?: Date }): Promise<{ events: TimelineEvent[] }> {
        try {
            const params = new URLSearchParams();
            if (dateRange?.startDate) {
                params.append('startDate', dateRange.startDate.toISOString());
            }
            if (dateRange?.endDate) {
                params.append('endDate', dateRange.endDate.toISOString());
            }

            const response = await fetch(`${this.baseUrl}/analytics/${creativeId}/events?${params}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al obtener eventos');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getEvents:', error);
            throw error;
        }
    }

    async getPlatformStats(creativeId: string, dateRange?: { startDate?: Date; endDate?: Date }): Promise<PlatformStats[]> {
        try {
            const params = new URLSearchParams();
            if (dateRange?.startDate) {
                params.append('startDate', dateRange.startDate.toISOString());
            }
            if (dateRange?.endDate) {
                params.append('endDate', dateRange.endDate.toISOString());
            }

            const response = await fetch(`${this.baseUrl}/analytics/${creativeId}/platforms?${params}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al obtener estadísticas por plataforma');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getPlatformStats:', error);
            throw error;
        }
    }

    async getInteractions(creativeId: string, dateRange?: { startDate?: Date; endDate?: Date }): Promise<{ interactions: TimelineInteraction[] }> {
        try {
            const params = new URLSearchParams();
            if (dateRange?.startDate) {
                params.append('startDate', dateRange.startDate.toISOString());
            }
            if (dateRange?.endDate) {
                params.append('endDate', dateRange.endDate.toISOString());
            }

            const response = await fetch(`${this.baseUrl}/analytics/${creativeId}/interactions?${params}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al obtener interacciones');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getInteractions:', error);
            throw error;
        }
    }
}

export const analyticsService = new AnalyticsService(); 
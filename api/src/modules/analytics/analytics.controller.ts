import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get(':id/stats')
    @ApiOperation({ summary: 'Obtener estadísticas de un creativo' })
    @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
    async getStats(
        @Param('id') id: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.analyticsService.getStats(id, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
    }

    @Get(':id/events')
    @ApiOperation({ summary: 'Obtener eventos de un creativo' })
    @ApiResponse({ status: 200, description: 'Eventos obtenidos exitosamente' })
    async getEvents(
        @Param('id') id: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.analyticsService.getEvents(id, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
    }

    @Get(':id/platforms')
    @ApiOperation({ summary: 'Obtener estadísticas por plataforma' })
    @ApiResponse({ status: 200, description: 'Estadísticas por plataforma obtenidas exitosamente' })
    async getPlatformStats(
        @Param('id') id: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.analyticsService.getPlatformStats(id, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
    }

    @Get(':id/interactions')
    @ApiOperation({ summary: 'Obtener interacciones de un creativo' })
    @ApiResponse({ status: 200, description: 'Interacciones obtenidas exitosamente' })
    async getInteractions(
        @Param('id') id: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.analyticsService.getInteractions(id, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
    }
} 
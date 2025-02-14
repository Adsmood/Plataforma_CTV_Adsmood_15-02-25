import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { InteractiveService } from './interactive.service';

@Controller('interactive')
export class InteractiveController {
  constructor(private readonly interactiveService: InteractiveService) {}

  @Get(':adId/interactions')
  getInteractions(@Param('adId') adId: string) {
    return this.interactiveService.getInteractions(adId);
  }

  @Get(':adId/overlays')
  getOverlays(@Param('adId') adId: string) {
    return this.interactiveService.getOverlays(adId);
  }

  @Post(':adId/interactions')
  createInteraction(@Param('adId') adId: string, @Body() data: any) {
    return this.interactiveService.createInteraction(adId, data);
  }

  @Post(':adId/overlays')
  createOverlay(@Param('adId') adId: string, @Body() data: any) {
    return this.interactiveService.createOverlay(adId, data);
  }

  @Put('interactions/:id')
  updateInteraction(@Param('id') id: string, @Body() data: any) {
    return this.interactiveService.updateInteraction(id, data);
  }

  @Put('overlays/:id')
  updateOverlay(@Param('id') id: string, @Body() data: any) {
    return this.interactiveService.updateOverlay(id, data);
  }

  @Delete('interactions/:id')
  deleteInteraction(@Param('id') id: string) {
    return this.interactiveService.deleteInteraction(id);
  }

  @Delete('overlays/:id')
  deleteOverlay(@Param('id') id: string) {
    return this.interactiveService.deleteOverlay(id);
  }
} 
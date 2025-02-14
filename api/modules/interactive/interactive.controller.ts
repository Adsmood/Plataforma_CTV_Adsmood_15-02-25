import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { InteractiveService } from './interactive.service';
import {
  CreateInteractionDto,
  CreateOverlayDto,
  UpdateInteractionDto,
  UpdateOverlayDto,
} from './dto/interactive.dto';

@ApiTags('Interactive')
@Controller('interactive')
export class InteractiveController {
  constructor(private readonly interactiveService: InteractiveService) {}

  @Post(':adId/interaction')
  @ApiOperation({ summary: 'Crear una nueva interacción' })
  @ApiParam({ name: 'adId', description: 'ID del anuncio' })
  @ApiResponse({ status: 201, description: 'Interacción creada' })
  async createInteraction(
    @Param('adId') adId: string,
    @Body() dto: CreateInteractionDto,
  ) {
    return this.interactiveService.createInteraction(adId, dto);
  }

  @Put('interaction/:id')
  @ApiOperation({ summary: 'Actualizar una interacción' })
  @ApiParam({ name: 'id', description: 'ID de la interacción' })
  @ApiResponse({ status: 200, description: 'Interacción actualizada' })
  async updateInteraction(
    @Param('id') id: string,
    @Body() dto: UpdateInteractionDto,
  ) {
    return this.interactiveService.updateInteraction(id, dto);
  }

  @Delete('interaction/:id')
  @ApiOperation({ summary: 'Eliminar una interacción' })
  @ApiParam({ name: 'id', description: 'ID de la interacción' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInteraction(@Param('id') id: string) {
    await this.interactiveService.deleteInteraction(id);
  }

  @Get(':adId/interactions')
  @ApiOperation({ summary: 'Obtener todas las interacciones de un anuncio' })
  @ApiParam({ name: 'adId', description: 'ID del anuncio' })
  @ApiResponse({ status: 200, description: 'Lista de interacciones' })
  async getInteractions(@Param('adId') adId: string) {
    return this.interactiveService.getInteractions(adId);
  }

  @Post(':adId/overlay')
  @ApiOperation({ summary: 'Crear un nuevo overlay' })
  @ApiParam({ name: 'adId', description: 'ID del anuncio' })
  @ApiResponse({ status: 201, description: 'Overlay creado' })
  async createOverlay(
    @Param('adId') adId: string,
    @Body() dto: CreateOverlayDto,
  ) {
    return this.interactiveService.createOverlay(adId, dto);
  }

  @Put('overlay/:id')
  @ApiOperation({ summary: 'Actualizar un overlay' })
  @ApiParam({ name: 'id', description: 'ID del overlay' })
  @ApiResponse({ status: 200, description: 'Overlay actualizado' })
  async updateOverlay(
    @Param('id') id: string,
    @Body() dto: UpdateOverlayDto,
  ) {
    return this.interactiveService.updateOverlay(id, dto);
  }

  @Delete('overlay/:id')
  @ApiOperation({ summary: 'Eliminar un overlay' })
  @ApiParam({ name: 'id', description: 'ID del overlay' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOverlay(@Param('id') id: string) {
    await this.interactiveService.deleteOverlay(id);
  }

  @Get(':adId/overlays')
  @ApiOperation({ summary: 'Obtener todos los overlays de un anuncio' })
  @ApiParam({ name: 'adId', description: 'ID del anuncio' })
  @ApiResponse({ status: 200, description: 'Lista de overlays' })
  async getOverlays(@Param('adId') adId: string) {
    return this.interactiveService.getOverlays(adId);
  }

  @Get(':adId')
  @ApiOperation({ summary: 'Obtener todos los datos interactivos de un anuncio' })
  @ApiParam({ name: 'adId', description: 'ID del anuncio' })
  @ApiResponse({ status: 200, description: 'Datos interactivos' })
  async getInteractiveData(@Param('adId') adId: string) {
    return this.interactiveService.getInteractiveData(adId);
  }
} 
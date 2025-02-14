import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInteractionDto, CreateOverlayDto, UpdateInteractionDto, UpdateOverlayDto } from './dto/interactive.dto';

@Injectable()
export class InteractiveService {
  constructor(private readonly prisma: PrismaService) {}

  async createInteraction(adId: string, dto: CreateInteractionDto) {
    return this.prisma.interaction.create({
      data: {
        type: dto.type,
        config: JSON.stringify(dto.config),
        position: JSON.stringify(dto.position),
        size: JSON.stringify(dto.size),
        startTime: dto.startTime,
        endTime: dto.endTime,
        adId,
      },
    });
  }

  async updateInteraction(id: string, dto: UpdateInteractionDto) {
    const interaction = await this.prisma.interaction.findUnique({
      where: { id },
    });

    if (!interaction) {
      throw new NotFoundException(`Interaction with ID ${id} not found`);
    }

    return this.prisma.interaction.update({
      where: { id },
      data: {
        type: dto.type,
        config: JSON.stringify(dto.config),
        position: JSON.stringify(dto.position),
        size: JSON.stringify(dto.size),
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  async deleteInteraction(id: string) {
    const interaction = await this.prisma.interaction.findUnique({
      where: { id },
    });

    if (!interaction) {
      throw new NotFoundException(`Interaction with ID ${id} not found`);
    }

    return this.prisma.interaction.delete({
      where: { id },
    });
  }

  async getInteractions(adId: string) {
    const interactions = await this.prisma.interaction.findMany({
      where: { adId },
    });

    return interactions.map(interaction => ({
      ...interaction,
      config: JSON.parse(interaction.config as string),
      position: JSON.parse(interaction.position as string),
      size: JSON.parse(interaction.size as string),
    }));
  }

  async createOverlay(adId: string, dto: CreateOverlayDto) {
    return this.prisma.overlay.create({
      data: {
        type: dto.type,
        content: dto.content,
        position: JSON.stringify(dto.position),
        size: JSON.stringify(dto.size),
        startTime: dto.startTime,
        endTime: dto.endTime,
        styles: dto.styles ? JSON.stringify(dto.styles) : undefined,
        zIndex: dto.zIndex || 0,
        adId,
      },
    });
  }

  async updateOverlay(id: string, dto: UpdateOverlayDto) {
    const overlay = await this.prisma.overlay.findUnique({
      where: { id },
    });

    if (!overlay) {
      throw new NotFoundException(`Overlay with ID ${id} not found`);
    }

    return this.prisma.overlay.update({
      where: { id },
      data: {
        type: dto.type,
        content: dto.content,
        position: JSON.stringify(dto.position),
        size: JSON.stringify(dto.size),
        startTime: dto.startTime,
        endTime: dto.endTime,
        styles: dto.styles ? JSON.stringify(dto.styles) : undefined,
        zIndex: dto.zIndex || 0,
      },
    });
  }

  async deleteOverlay(id: string) {
    const overlay = await this.prisma.overlay.findUnique({
      where: { id },
    });

    if (!overlay) {
      throw new NotFoundException(`Overlay with ID ${id} not found`);
    }

    return this.prisma.overlay.delete({
      where: { id },
    });
  }

  async getOverlays(adId: string) {
    const overlays = await this.prisma.overlay.findMany({
      where: { adId },
    });

    return overlays.map(overlay => ({
      ...overlay,
      position: JSON.parse(overlay.position as string),
      size: JSON.parse(overlay.size as string),
      styles: overlay.styles ? JSON.parse(overlay.styles as string) : null,
    }));
  }

  async getInteractiveData(adId: string) {
    const [interactions, overlays] = await Promise.all([
      this.getInteractions(adId),
      this.getOverlays(adId),
    ]);

    return {
      interactions,
      overlays,
    };
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInteractionDto, UpdateInteractionDto } from './dto/interaction.dto';
import { CreateOverlayDto, UpdateOverlayDto } from './dto/overlay.dto';

@Injectable()
export class InteractiveService {
  constructor(private prisma: PrismaService) {}

  async getInteractions(adId: string) {
    return this.prisma.interaction.findMany({
      where: { adId },
      orderBy: { startTime: 'asc' },
    });
  }

  async getOverlays(adId: string) {
    return this.prisma.overlay.findMany({
      where: { adId },
      orderBy: { startTime: 'asc' },
    });
  }

  async createInteraction(adId: string, data: CreateInteractionDto) {
    return this.prisma.interaction.create({
      data: {
        ...data,
        adId,
      },
    });
  }

  async createOverlay(adId: string, data: CreateOverlayDto) {
    return this.prisma.overlay.create({
      data: {
        ...data,
        adId,
      },
    });
  }

  async updateInteraction(id: string, data: UpdateInteractionDto) {
    return this.prisma.interaction.update({
      where: { id },
      data,
    });
  }

  async updateOverlay(id: string, data: UpdateOverlayDto) {
    return this.prisma.overlay.update({
      where: { id },
      data,
    });
  }

  async deleteInteraction(id: string) {
    return this.prisma.interaction.delete({
      where: { id },
    });
  }

  async deleteOverlay(id: string) {
    return this.prisma.overlay.delete({
      where: { id },
    });
  }
} 
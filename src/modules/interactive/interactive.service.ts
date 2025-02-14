import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateInteractionDto,
  CreateOverlayDto,
  UpdateInteractionDto,
  UpdateOverlayDto,
} from './dto/interactive.dto';

@Injectable()
export class InteractiveService {
  constructor(private readonly prisma: PrismaService) {}

  async createInteraction(adId: string, dto: CreateInteractionDto) {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) throw new NotFoundException(`Ad with ID ${adId} not found`);

    return this.prisma.interaction.create({
      data: {
        ...dto,
        ad: { connect: { id: adId } },
      },
    });
  }

  async updateInteraction(id: string, dto: UpdateInteractionDto) {
    const interaction = await this.prisma.interaction.findUnique({
      where: { id },
    });
    if (!interaction)
      throw new NotFoundException(`Interaction with ID ${id} not found`);

    return this.prisma.interaction.update({
      where: { id },
      data: dto,
    });
  }

  async deleteInteraction(id: string) {
    const interaction = await this.prisma.interaction.findUnique({
      where: { id },
    });
    if (!interaction)
      throw new NotFoundException(`Interaction with ID ${id} not found`);

    await this.prisma.interaction.delete({ where: { id } });
  }

  async getInteractions(adId: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) throw new NotFoundException(`Ad with ID ${adId} not found`);

    return this.prisma.interaction.findMany({
      where: { adId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOverlay(adId: string, dto: CreateOverlayDto) {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) throw new NotFoundException(`Ad with ID ${adId} not found`);

    return this.prisma.overlay.create({
      data: {
        ...dto,
        ad: { connect: { id: adId } },
      },
    });
  }

  async updateOverlay(id: string, dto: UpdateOverlayDto) {
    const overlay = await this.prisma.overlay.findUnique({
      where: { id },
    });
    if (!overlay) throw new NotFoundException(`Overlay with ID ${id} not found`);

    return this.prisma.overlay.update({
      where: { id },
      data: dto,
    });
  }

  async deleteOverlay(id: string) {
    const overlay = await this.prisma.overlay.findUnique({
      where: { id },
    });
    if (!overlay) throw new NotFoundException(`Overlay with ID ${id} not found`);

    await this.prisma.overlay.delete({ where: { id } });
  }

  async getOverlays(adId: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) throw new NotFoundException(`Ad with ID ${adId} not found`);

    return this.prisma.overlay.findMany({
      where: { adId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInteractiveData(adId: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) throw new NotFoundException(`Ad with ID ${adId} not found`);

    const [interactions, overlays] = await Promise.all([
      this.prisma.interaction.findMany({
        where: { adId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.overlay.findMany({
        where: { adId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      interactions,
      overlays,
    };
  }
} 
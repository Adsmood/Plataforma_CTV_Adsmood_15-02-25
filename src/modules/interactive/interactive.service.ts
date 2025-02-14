import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInteractionDto, CreateOverlayDto, UpdateInteractionDto, UpdateOverlayDto } from './dto/interactive.dto';
import { Prisma } from '@prisma/client';

type InteractionWithParsedJson = {
  id: string;
  type: string;
  config: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  startTime: number;
  endTime?: number | null;
  adId: string;
  createdAt: Date;
  updatedAt: Date;
};

type OverlayWithParsedJson = {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  startTime: number;
  endTime?: number | null;
  zIndex: number;
  styles?: any | null;
  adId: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class InteractiveService {
  constructor(private readonly prisma: PrismaService) {}

  async createInteraction(adId: string, dto: CreateInteractionDto): Promise<InteractionWithParsedJson> {
    const interaction = await this.prisma.$transaction(async (prisma) => {
      return prisma.$queryRaw`
        INSERT INTO interactions (
          type,
          config,
          position,
          size,
          start_time,
          end_time,
          ad_id,
          created_at,
          updated_at
        ) VALUES (
          ${dto.type},
          ${JSON.stringify(dto.config)}::jsonb,
          ${JSON.stringify(dto.position)}::jsonb,
          ${JSON.stringify(dto.size)}::jsonb,
          ${dto.startTime},
          ${dto.endTime || null},
          ${adId},
          NOW(),
          NOW()
        )
        RETURNING *;
      `;
    });

    const result = Array.isArray(interaction) ? interaction[0] : interaction;
    return this.parseInteractionJson(result);
  }

  async updateInteraction(id: string, dto: UpdateInteractionDto): Promise<InteractionWithParsedJson> {
    const exists = await this.prisma.$queryRaw`
      SELECT id FROM interactions WHERE id = ${id};
    `;

    if (!exists || !Array.isArray(exists) || exists.length === 0) {
      throw new NotFoundException(`Interaction with ID ${id} not found`);
    }

    const interaction = await this.prisma.$transaction(async (prisma) => {
      return prisma.$queryRaw`
        UPDATE interactions
        SET
          type = ${dto.type},
          config = ${JSON.stringify(dto.config)}::jsonb,
          position = ${JSON.stringify(dto.position)}::jsonb,
          size = ${JSON.stringify(dto.size)}::jsonb,
          start_time = ${dto.startTime},
          end_time = ${dto.endTime || null},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *;
      `;
    });

    const result = Array.isArray(interaction) ? interaction[0] : interaction;
    return this.parseInteractionJson(result);
  }

  async deleteInteraction(id: string): Promise<void> {
    const exists = await this.prisma.$queryRaw`
      SELECT id FROM interactions WHERE id = ${id};
    `;

    if (!exists || !Array.isArray(exists) || exists.length === 0) {
      throw new NotFoundException(`Interaction with ID ${id} not found`);
    }

    await this.prisma.$executeRaw`
      DELETE FROM interactions WHERE id = ${id};
    `;
  }

  async getInteractions(adId: string): Promise<InteractionWithParsedJson[]> {
    const interactions = await this.prisma.$queryRaw`
      SELECT * FROM interactions WHERE ad_id = ${adId};
    `;

    return Array.isArray(interactions) 
      ? interactions.map(interaction => this.parseInteractionJson(interaction))
      : [];
  }

  async createOverlay(adId: string, dto: CreateOverlayDto): Promise<OverlayWithParsedJson> {
    const overlay = await this.prisma.$transaction(async (prisma) => {
      return prisma.$queryRaw`
        INSERT INTO overlays (
          type,
          content,
          position,
          size,
          start_time,
          end_time,
          styles,
          z_index,
          ad_id,
          created_at,
          updated_at
        ) VALUES (
          ${dto.type},
          ${dto.content},
          ${JSON.stringify(dto.position)}::jsonb,
          ${JSON.stringify(dto.size)}::jsonb,
          ${dto.startTime},
          ${dto.endTime || null},
          ${dto.styles ? JSON.stringify(dto.styles) : null}::jsonb,
          ${dto.zIndex || 0},
          ${adId},
          NOW(),
          NOW()
        )
        RETURNING *;
      `;
    });

    const result = Array.isArray(overlay) ? overlay[0] : overlay;
    return this.parseOverlayJson(result);
  }

  async updateOverlay(id: string, dto: UpdateOverlayDto): Promise<OverlayWithParsedJson> {
    const exists = await this.prisma.$queryRaw`
      SELECT id FROM overlays WHERE id = ${id};
    `;

    if (!exists || !Array.isArray(exists) || exists.length === 0) {
      throw new NotFoundException(`Overlay with ID ${id} not found`);
    }

    const overlay = await this.prisma.$transaction(async (prisma) => {
      return prisma.$queryRaw`
        UPDATE overlays
        SET
          type = ${dto.type},
          content = ${dto.content},
          position = ${JSON.stringify(dto.position)}::jsonb,
          size = ${JSON.stringify(dto.size)}::jsonb,
          start_time = ${dto.startTime},
          end_time = ${dto.endTime || null},
          styles = ${dto.styles ? JSON.stringify(dto.styles) : null}::jsonb,
          z_index = ${dto.zIndex || 0},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *;
      `;
    });

    const result = Array.isArray(overlay) ? overlay[0] : overlay;
    return this.parseOverlayJson(result);
  }

  async deleteOverlay(id: string): Promise<void> {
    const exists = await this.prisma.$queryRaw`
      SELECT id FROM overlays WHERE id = ${id};
    `;

    if (!exists || !Array.isArray(exists) || exists.length === 0) {
      throw new NotFoundException(`Overlay with ID ${id} not found`);
    }

    await this.prisma.$executeRaw`
      DELETE FROM overlays WHERE id = ${id};
    `;
  }

  async getOverlays(adId: string): Promise<OverlayWithParsedJson[]> {
    const overlays = await this.prisma.$queryRaw`
      SELECT * FROM overlays WHERE ad_id = ${adId};
    `;

    return Array.isArray(overlays) 
      ? overlays.map(overlay => this.parseOverlayJson(overlay))
      : [];
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

  private parseInteractionJson(interaction: any): InteractionWithParsedJson {
    return {
      ...interaction,
      config: typeof interaction.config === 'string' ? JSON.parse(interaction.config) : interaction.config,
      position: typeof interaction.position === 'string' ? JSON.parse(interaction.position) : interaction.position,
      size: typeof interaction.size === 'string' ? JSON.parse(interaction.size) : interaction.size,
    };
  }

  private parseOverlayJson(overlay: any): OverlayWithParsedJson {
    return {
      ...overlay,
      position: typeof overlay.position === 'string' ? JSON.parse(overlay.position) : overlay.position,
      size: typeof overlay.size === 'string' ? JSON.parse(overlay.size) : overlay.size,
      styles: overlay.styles 
        ? (typeof overlay.styles === 'string' ? JSON.parse(overlay.styles) : overlay.styles)
        : null,
    };
  }
}
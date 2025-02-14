"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InteractiveService = class InteractiveService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInteraction(adId, dto) {
        const interaction = await this.prisma.$transaction(async (prisma) => {
            return prisma.$queryRaw `
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
    async updateInteraction(id, dto) {
        const exists = await this.prisma.$queryRaw `
      SELECT id FROM interactions WHERE id = ${id};
    `;
        if (!exists || !Array.isArray(exists) || exists.length === 0) {
            throw new common_1.NotFoundException(`Interaction with ID ${id} not found`);
        }
        const interaction = await this.prisma.$transaction(async (prisma) => {
            return prisma.$queryRaw `
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
    async deleteInteraction(id) {
        const exists = await this.prisma.$queryRaw `
      SELECT id FROM interactions WHERE id = ${id};
    `;
        if (!exists || !Array.isArray(exists) || exists.length === 0) {
            throw new common_1.NotFoundException(`Interaction with ID ${id} not found`);
        }
        await this.prisma.$executeRaw `
      DELETE FROM interactions WHERE id = ${id};
    `;
    }
    async getInteractions(adId) {
        const interactions = await this.prisma.$queryRaw `
      SELECT * FROM interactions WHERE ad_id = ${adId};
    `;
        return Array.isArray(interactions)
            ? interactions.map(interaction => this.parseInteractionJson(interaction))
            : [];
    }
    async createOverlay(adId, dto) {
        const overlay = await this.prisma.$transaction(async (prisma) => {
            return prisma.$queryRaw `
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
    async updateOverlay(id, dto) {
        const exists = await this.prisma.$queryRaw `
      SELECT id FROM overlays WHERE id = ${id};
    `;
        if (!exists || !Array.isArray(exists) || exists.length === 0) {
            throw new common_1.NotFoundException(`Overlay with ID ${id} not found`);
        }
        const overlay = await this.prisma.$transaction(async (prisma) => {
            return prisma.$queryRaw `
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
    async deleteOverlay(id) {
        const exists = await this.prisma.$queryRaw `
      SELECT id FROM overlays WHERE id = ${id};
    `;
        if (!exists || !Array.isArray(exists) || exists.length === 0) {
            throw new common_1.NotFoundException(`Overlay with ID ${id} not found`);
        }
        await this.prisma.$executeRaw `
      DELETE FROM overlays WHERE id = ${id};
    `;
    }
    async getOverlays(adId) {
        const overlays = await this.prisma.$queryRaw `
      SELECT * FROM overlays WHERE ad_id = ${adId};
    `;
        return Array.isArray(overlays)
            ? overlays.map(overlay => this.parseOverlayJson(overlay))
            : [];
    }
    async getInteractiveData(adId) {
        const [interactions, overlays] = await Promise.all([
            this.getInteractions(adId),
            this.getOverlays(adId),
        ]);
        return {
            interactions,
            overlays,
        };
    }
    parseInteractionJson(interaction) {
        return Object.assign(Object.assign({}, interaction), { config: typeof interaction.config === 'string' ? JSON.parse(interaction.config) : interaction.config, position: typeof interaction.position === 'string' ? JSON.parse(interaction.position) : interaction.position, size: typeof interaction.size === 'string' ? JSON.parse(interaction.size) : interaction.size });
    }
    parseOverlayJson(overlay) {
        return Object.assign(Object.assign({}, overlay), { position: typeof overlay.position === 'string' ? JSON.parse(overlay.position) : overlay.position, size: typeof overlay.size === 'string' ? JSON.parse(overlay.size) : overlay.size, styles: overlay.styles
                ? (typeof overlay.styles === 'string' ? JSON.parse(overlay.styles) : overlay.styles)
                : null });
    }
};
exports.InteractiveService = InteractiveService;
exports.InteractiveService = InteractiveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InteractiveService);
//# sourceMappingURL=interactive.service.js.map
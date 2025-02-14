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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InteractiveService = class InteractiveService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInteractions(adId) {
        return this.prisma.interaction.findMany({
            where: { adId },
            orderBy: { startTime: 'asc' },
        });
    }
    async getOverlays(adId) {
        return this.prisma.overlay.findMany({
            where: { adId },
            orderBy: { startTime: 'asc' },
        });
    }
    async createInteraction(adId, data) {
        return this.prisma.interaction.create({
            data: Object.assign(Object.assign({}, data), { adId }),
        });
    }
    async createOverlay(adId, data) {
        return this.prisma.overlay.create({
            data: Object.assign(Object.assign({}, data), { adId }),
        });
    }
    async updateInteraction(id, data) {
        return this.prisma.interaction.update({
            where: { id },
            data,
        });
    }
    async updateOverlay(id, data) {
        return this.prisma.overlay.update({
            where: { id },
            data,
        });
    }
    async deleteInteraction(id) {
        return this.prisma.interaction.delete({
            where: { id },
        });
    }
    async deleteOverlay(id) {
        return this.prisma.overlay.delete({
            where: { id },
        });
    }
};
exports.InteractiveService = InteractiveService;
exports.InteractiveService = InteractiveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InteractiveService);
//# sourceMappingURL=interactive.service.js.map
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
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TrackingService = class TrackingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackEvent(type, adId, metadata) {
        await this.prisma.trackingEvent.create({
            data: {
                type,
                adId,
                timestamp: new Date(),
                metadata,
            },
        });
        await this.updateMetrics(type, adId);
    }
    async updateMetrics(type, adId) {
        const metrics = await this.prisma.adMetrics.findUnique({
            where: { adId },
        });
        const update = {};
        switch (type) {
            case 'impression':
                update.impressions = ((metrics === null || metrics === void 0 ? void 0 : metrics.impressions) || 0) + 1;
                break;
            case 'start':
                update.starts = ((metrics === null || metrics === void 0 ? void 0 : metrics.starts) || 0) + 1;
                break;
            case 'firstQuartile':
                update.firstQuartiles = ((metrics === null || metrics === void 0 ? void 0 : metrics.firstQuartiles) || 0) + 1;
                break;
            case 'midpoint':
                update.midpoints = ((metrics === null || metrics === void 0 ? void 0 : metrics.midpoints) || 0) + 1;
                break;
            case 'thirdQuartile':
                update.thirdQuartiles = ((metrics === null || metrics === void 0 ? void 0 : metrics.thirdQuartiles) || 0) + 1;
                break;
            case 'complete':
                update.completes = ((metrics === null || metrics === void 0 ? void 0 : metrics.completes) || 0) + 1;
                break;
            case 'click':
                update.clicks = ((metrics === null || metrics === void 0 ? void 0 : metrics.clicks) || 0) + 1;
                break;
            case 'mute':
                update.mutes = ((metrics === null || metrics === void 0 ? void 0 : metrics.mutes) || 0) + 1;
                break;
            case 'unmute':
                update.unmutes = ((metrics === null || metrics === void 0 ? void 0 : metrics.unmutes) || 0) + 1;
                break;
            case 'pause':
                update.pauses = ((metrics === null || metrics === void 0 ? void 0 : metrics.pauses) || 0) + 1;
                break;
            case 'resume':
                update.resumes = ((metrics === null || metrics === void 0 ? void 0 : metrics.resumes) || 0) + 1;
                break;
            case 'fullscreen':
                update.fullscreen = ((metrics === null || metrics === void 0 ? void 0 : metrics.fullscreen) || 0) + 1;
                break;
            case 'exitFullscreen':
                update.exitFullscreen = ((metrics === null || metrics === void 0 ? void 0 : metrics.exitFullscreen) || 0) + 1;
                break;
        }
        if (Object.keys(update).length > 0) {
            await this.prisma.adMetrics.upsert({
                where: { adId },
                create: Object.assign({ adId }, update),
                update,
            });
        }
    }
    async getMetrics(adId) {
        return this.prisma.adMetrics.findUnique({
            where: { adId },
        });
    }
    async getEvents(adId, type) {
        return this.prisma.trackingEvent.findMany({
            where: Object.assign({ adId }, (type ? { type } : {})),
            orderBy: {
                timestamp: 'desc',
            },
        });
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map
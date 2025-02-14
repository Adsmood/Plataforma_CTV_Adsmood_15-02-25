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
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
let TrackingService = class TrackingService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.eventQueue = [];
        this.flushTimeout = null;
        this.batchSize = this.config.get('TRACKING_BATCH_SIZE', 100);
        this.flushInterval = this.config.get('TRACKING_FLUSH_INTERVAL', 60000);
    }
    async onModuleInit() {
        this.scheduleFlush();
    }
    async onModuleDestroy() {
        if (this.flushTimeout) {
            clearTimeout(this.flushTimeout);
        }
        await this.flushEvents();
    }
    scheduleFlush() {
        if (this.flushTimeout) {
            clearTimeout(this.flushTimeout);
        }
        this.flushTimeout = setTimeout(() => this.flushEvents(), this.flushInterval);
    }
    async flushEvents() {
        if (this.eventQueue.length === 0)
            return;
        const events = [...this.eventQueue];
        this.eventQueue = [];
        try {
            for (let i = 0; i < events.length; i += this.batchSize) {
                const batch = events.slice(i, i + this.batchSize);
                await this.processBatch(batch);
            }
        }
        catch (error) {
            console.error('Error al procesar eventos:', error);
            this.eventQueue.push(...events);
        }
    }
    async processBatch(events) {
        await this.prisma.$transaction(async (tx) => {
            await tx.trackingEvent.createMany({
                data: events.map(event => ({
                    type: event.type,
                    adId: event.adId,
                    userAgent: event.userAgent,
                    ipAddress: event.ipAddress,
                    timestamp: event.timestamp,
                    metadata: event.metadata,
                })),
            });
            const metricUpdates = events.reduce((acc, event) => {
                const key = `${event.adId}-${event.type}`;
                if (!acc[key]) {
                    acc[key] = {
                        adId: event.adId,
                        type: event.type,
                        count: 0,
                    };
                }
                acc[key].count++;
                return acc;
            }, {});
            for (const update of Object.values(metricUpdates)) {
                await tx.adMetrics.upsert({
                    where: { adId: update.adId },
                    create: {
                        adId: update.adId,
                        [update.type]: update.count,
                    },
                    update: {
                        [update.type]: {
                            increment: update.count,
                        },
                    },
                });
            }
        });
    }
    async trackEvent(event, adId, data) {
        const trackingEvent = {
            type: event,
            adId,
            userAgent: data.userAgent,
            ipAddress: data.ip,
            timestamp: data.timestamp || new Date(),
            metadata: data,
        };
        this.eventQueue.push(trackingEvent);
        if (this.eventQueue.length >= this.batchSize) {
            await this.flushEvents();
        }
        else {
            this.scheduleFlush();
        }
        return { success: true, queued: this.eventQueue.length };
    }
    async getMetrics(adId) {
        const [metrics, events] = await Promise.all([
            this.prisma.adMetrics.findUnique({
                where: { adId },
            }),
            this.prisma.trackingEvent.findMany({
                where: {
                    adId,
                    timestamp: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { timestamp: 'desc' },
                take: 1000,
            }),
        ]);
        return {
            metrics,
            recentEvents: events,
            queuedEvents: this.eventQueue.filter(e => e.adId === adId).length,
        };
    }
    async getAggregatedMetrics(period = 'day') {
        const startDate = new Date();
        switch (period) {
            case 'hour':
                startDate.setHours(startDate.getHours() - 1);
                break;
            case 'day':
                startDate.setDate(startDate.getDate() - 1);
                break;
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
        }
        const events = await this.prisma.trackingEvent.groupBy({
            by: ['type', 'adId'],
            where: {
                timestamp: {
                    gte: startDate,
                },
            },
            _count: true,
        });
        return events;
    }
};
exports.TrackingService = TrackingService;
__decorate([
    (0, schedule_1.Interval)(60000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrackingService.prototype, "flushEvents", null);
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map
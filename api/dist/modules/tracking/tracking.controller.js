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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingController = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const swagger_1 = require("@nestjs/swagger");
const tracking_service_1 = require("./tracking.service");
const tracking_dto_1 = require("./dto/tracking.dto");
const config_1 = require("@nestjs/config");
let TrackingController = class TrackingController {
    constructor(trackingService, config) {
        this.trackingService = trackingService;
        this.config = config;
    }
    async trackImpression(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('impression', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackStart(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('start', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackFirstQuartile(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('firstQuartile', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackMidpoint(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('midpoint', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackThirdQuartile(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('thirdQuartile', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackComplete(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('complete', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackClick(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('click', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackMute(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('mute', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackUnmute(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('unmute', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackPause(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('pause', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackResume(id, query, userAgent, ip) {
        await this.trackingService.trackEvent('resume', id, Object.assign(Object.assign({}, query), { userAgent,
            ip, timestamp: new Date() }));
    }
    async trackInteractiveEvent(id, event, userAgent, ip) {
        await this.trackingService.trackEvent('interactive', id, Object.assign(Object.assign({}, event), { userAgent,
            ip, timestamp: new Date() }));
    }
    async getMetrics(id) {
        return this.trackingService.getMetrics(id);
    }
    async getAggregatedMetrics(period) {
        return this.trackingService.getAggregatedMetrics(period);
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, common_1.Get)('impression/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar impresión de anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, swagger_1.ApiHeader)({ name: 'User-Agent', required: false }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackImpression", null);
__decorate([
    (0, common_1.Get)('start/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar inicio de reproducción' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackStart", null);
__decorate([
    (0, common_1.Get)('firstQuartile/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar primer cuartil de reproducción' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackFirstQuartile", null);
__decorate([
    (0, common_1.Get)('midpoint/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar punto medio de reproducción' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackMidpoint", null);
__decorate([
    (0, common_1.Get)('thirdQuartile/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar tercer cuartil de reproducción' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackThirdQuartile", null);
__decorate([
    (0, common_1.Get)('complete/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar finalización de reproducción' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackComplete", null);
__decorate([
    (0, common_1.Get)('click/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar clic en anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackClick", null);
__decorate([
    (0, common_1.Get)('mute/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar silenciamiento de anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackMute", null);
__decorate([
    (0, common_1.Get)('unmute/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar activación de sonido de anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackUnmute", null);
__decorate([
    (0, common_1.Get)('pause/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar pausa de anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackPause", null);
__decorate([
    (0, common_1.Get)('resume/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar reanudación de anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackingQueryDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackResume", null);
__decorate([
    (0, common_1.Post)('interactive/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar evento de interactividad' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ type: tracking_dto_1.TrackingQueryDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.TrackEventDto, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackInteractiveEvent", null);
__decorate([
    (0, common_1.Get)('metrics/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener métricas de un anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Métricas del anuncio',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/aggregated'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener métricas agregadas' }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        enum: ['hour', 'day', 'week', 'month'],
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Métricas agregadas',
    }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getAggregatedMetrics", null);
exports.TrackingController = TrackingController = __decorate([
    (0, swagger_1.ApiTags)('Tracking'),
    (0, common_1.Controller)('track'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService,
        config_1.ConfigService])
], TrackingController);
//# sourceMappingURL=tracking.controller.js.map
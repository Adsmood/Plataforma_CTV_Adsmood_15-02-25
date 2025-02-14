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
const tracking_service_1 = require("./tracking.service");
const tracking_dto_1 = require("./dto/tracking.dto");
let TrackingController = class TrackingController {
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    async trackEvent(type, adId, metadata) {
        await this.trackingService.trackEvent(type, adId, metadata);
        return { success: true };
    }
    getMetrics(adId) {
        return this.trackingService.getMetrics(adId);
    }
    getEvents(adId, query) {
        return this.trackingService.getEvents(adId, query.type);
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, common_1.Post)(':type/:adId'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('adId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "trackEvent", null);
__decorate([
    (0, common_1.Get)('metrics/:adId'),
    __param(0, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('events/:adId'),
    __param(0, (0, common_1.Param)('adId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.GetEventsQueryDto]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "getEvents", null);
exports.TrackingController = TrackingController = __decorate([
    (0, common_1.Controller)('track'),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService])
], TrackingController);
//# sourceMappingURL=tracking.controller.js.map
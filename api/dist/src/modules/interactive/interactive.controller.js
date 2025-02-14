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
exports.InteractiveController = void 0;
const common_1 = require("@nestjs/common");
const interactive_service_1 = require("./interactive.service");
const interaction_dto_1 = require("./dto/interaction.dto");
const overlay_dto_1 = require("./dto/overlay.dto");
let InteractiveController = class InteractiveController {
    constructor(interactiveService) {
        this.interactiveService = interactiveService;
    }
    getInteractions(adId) {
        return this.interactiveService.getInteractions(adId);
    }
    getOverlays(adId) {
        return this.interactiveService.getOverlays(adId);
    }
    createInteraction(adId, data) {
        return this.interactiveService.createInteraction(adId, data);
    }
    createOverlay(adId, data) {
        return this.interactiveService.createOverlay(adId, data);
    }
    updateInteraction(id, data) {
        return this.interactiveService.updateInteraction(id, data);
    }
    updateOverlay(id, data) {
        return this.interactiveService.updateOverlay(id, data);
    }
    deleteInteraction(id) {
        return this.interactiveService.deleteInteraction(id);
    }
    deleteOverlay(id) {
        return this.interactiveService.deleteOverlay(id);
    }
};
exports.InteractiveController = InteractiveController;
__decorate([
    (0, common_1.Get)(':adId/interactions'),
    __param(0, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractiveController.prototype, "getInteractions", null);
__decorate([
    (0, common_1.Get)(':adId/overlays'),
    __param(0, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractiveController.prototype, "getOverlays", null);
__decorate([
    (0, common_1.Post)(':adId/interactions'),
    __param(0, (0, common_1.Param)('adId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, interaction_dto_1.CreateInteractionDto]),
    __metadata("design:returntype", void 0)
], InteractiveController.prototype, "createInteraction", null);
__decorate([
    (0, common_1.Post)(':adId/overlays'),
    __param(0, (0, common_1.Param)('adId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, overlay_dto_1.CreateOverlayDto]),
    __metadata("design:returntype", void 0)
], InteractiveController.prototype, "createOverlay", null);
__decorate([
    (0, common_1.Put)('interactions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, interaction_dto_1.UpdateInteractionDto]),
    __metadata("design:returntype", void 0)
], InteractiveController.prototype, "updateInteraction", null);
__decorate([
    (0, common_1.Put)('overlays/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, overlay_dto_1.UpdateOverlayDto]),
    __metadata("design:returntype", void 0)
], InteractiveController.prototype, "updateOverlay", null);
__decorate([
    (0, common_1.Delete)('interactions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractiveController.prototype, "deleteInteraction", null);
__decorate([
    (0, common_1.Delete)('overlays/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractiveController.prototype, "deleteOverlay", null);
exports.InteractiveController = InteractiveController = __decorate([
    (0, common_1.Controller)('interactive'),
    __metadata("design:paramtypes", [interactive_service_1.InteractiveService])
], InteractiveController);
//# sourceMappingURL=interactive.controller.js.map
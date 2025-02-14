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
const swagger_1 = require("@nestjs/swagger");
const interactive_service_1 = require("./interactive.service");
const interactive_dto_1 = require("./dto/interactive.dto");
let InteractiveController = class InteractiveController {
    constructor(interactiveService) {
        this.interactiveService = interactiveService;
    }
    async createInteraction(adId, dto) {
        return this.interactiveService.createInteraction(adId, dto);
    }
    async updateInteraction(id, dto) {
        return this.interactiveService.updateInteraction(id, dto);
    }
    async deleteInteraction(id) {
        await this.interactiveService.deleteInteraction(id);
    }
    async getInteractions(adId) {
        return this.interactiveService.getInteractions(adId);
    }
    async createOverlay(adId, dto) {
        return this.interactiveService.createOverlay(adId, dto);
    }
    async updateOverlay(id, dto) {
        return this.interactiveService.updateOverlay(id, dto);
    }
    async deleteOverlay(id) {
        await this.interactiveService.deleteOverlay(id);
    }
    async getOverlays(adId) {
        return this.interactiveService.getOverlays(adId);
    }
    async getInteractiveData(adId) {
        return this.interactiveService.getInteractiveData(adId);
    }
};
exports.InteractiveController = InteractiveController;
__decorate([
    (0, common_1.Post)(':adId/interaction'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva interacción' }),
    (0, swagger_1.ApiParam)({ name: 'adId', description: 'ID del anuncio' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Interacción creada' }),
    __param(0, (0, common_1.Param)('adId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, interactive_dto_1.CreateInteractionDto]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "createInteraction", null);
__decorate([
    (0, common_1.Put)('interaction/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una interacción' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la interacción' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interacción actualizada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, interactive_dto_1.UpdateInteractionDto]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "updateInteraction", null);
__decorate([
    (0, common_1.Delete)('interaction/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una interacción' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la interacción' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "deleteInteraction", null);
__decorate([
    (0, common_1.Get)(':adId/interactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las interacciones de un anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'adId', description: 'ID del anuncio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de interacciones' }),
    __param(0, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "getInteractions", null);
__decorate([
    (0, common_1.Post)(':adId/overlay'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo overlay' }),
    (0, swagger_1.ApiParam)({ name: 'adId', description: 'ID del anuncio' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Overlay creado' }),
    __param(0, (0, common_1.Param)('adId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, interactive_dto_1.CreateOverlayDto]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "createOverlay", null);
__decorate([
    (0, common_1.Put)('overlay/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un overlay' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del overlay' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overlay actualizado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, interactive_dto_1.UpdateOverlayDto]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "updateOverlay", null);
__decorate([
    (0, common_1.Delete)('overlay/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un overlay' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del overlay' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "deleteOverlay", null);
__decorate([
    (0, common_1.Get)(':adId/overlays'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los overlays de un anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'adId', description: 'ID del anuncio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de overlays' }),
    __param(0, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "getOverlays", null);
__decorate([
    (0, common_1.Get)(':adId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los datos interactivos de un anuncio' }),
    (0, swagger_1.ApiParam)({ name: 'adId', description: 'ID del anuncio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Datos interactivos' }),
    __param(0, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "getInteractiveData", null);
exports.InteractiveController = InteractiveController = __decorate([
    (0, swagger_1.ApiTags)('Interactive'),
    (0, common_1.Controller)('interactive'),
    __metadata("design:paramtypes", [interactive_service_1.InteractiveService])
], InteractiveController);
//# sourceMappingURL=interactive.controller.js.map
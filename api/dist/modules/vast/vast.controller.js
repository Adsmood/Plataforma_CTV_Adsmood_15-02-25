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
exports.VastController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vast_service_1 = require("./vast.service");
let VastController = class VastController {
    constructor(vastService) {
        this.vastService = vastService;
    }
    async generateVast(id, platform) {
        return this.vastService.generateVast(id, platform);
    }
};
exports.VastController = VastController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.Header)('Content-Type', 'application/xml'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar VAST XML dinámicamente' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del anuncio' }),
    (0, swagger_1.ApiQuery)({ name: 'platform', required: false, description: 'Plataforma específica (roku, fire_tv, etc.)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('platform')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VastController.prototype, "generateVast", null);
exports.VastController = VastController = __decorate([
    (0, swagger_1.ApiTags)('VAST'),
    (0, common_1.Controller)('vast'),
    __metadata("design:paramtypes", [vast_service_1.VastService])
], VastController);
//# sourceMappingURL=vast.controller.js.map
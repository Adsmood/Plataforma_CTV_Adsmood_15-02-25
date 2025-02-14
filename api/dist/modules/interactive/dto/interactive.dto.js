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
exports.UpdateOverlayDto = exports.UpdateInteractionDto = exports.CreateOverlayDto = exports.CreateInteractionDto = exports.SizeDto = exports.PositionDto = exports.OverlayType = exports.InteractionType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var InteractionType;
(function (InteractionType) {
    InteractionType["BUTTON"] = "button";
    InteractionType["CAROUSEL"] = "carousel";
    InteractionType["GALLERY"] = "gallery";
    InteractionType["TRIVIA"] = "trivia";
    InteractionType["QR"] = "qr";
    InteractionType["CHOICE"] = "choice";
})(InteractionType || (exports.InteractionType = InteractionType = {}));
var OverlayType;
(function (OverlayType) {
    OverlayType["HTML"] = "html";
    OverlayType["IMAGE"] = "image";
    OverlayType["VIDEO"] = "video";
})(OverlayType || (exports.OverlayType = OverlayType = {}));
class PositionDto {
    constructor() {
        this.x = 50;
        this.y = 50;
    }
}
exports.PositionDto = PositionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posición X (0-100)', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PositionDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posición Y (0-100)', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PositionDto.prototype, "y", void 0);
class SizeDto {
    constructor() {
        this.width = 100;
        this.height = 100;
    }
}
exports.SizeDto = SizeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ancho (0-100)', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SizeDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alto (0-100)', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SizeDto.prototype, "height", void 0);
class CreateInteractionDto {
}
exports.CreateInteractionDto = CreateInteractionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: InteractionType, description: 'Tipo de interacción' }),
    (0, class_validator_1.IsEnum)(InteractionType),
    __metadata("design:type", String)
], CreateInteractionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuración específica de la interacción' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateInteractionDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PositionDto, description: 'Posición de la interacción' }),
    (0, class_transformer_1.Type)(() => PositionDto),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", PositionDto)
], CreateInteractionDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SizeDto, description: 'Tamaño de la interacción' }),
    (0, class_transformer_1.Type)(() => SizeDto),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", SizeDto)
], CreateInteractionDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tiempo de inicio en segundos' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInteractionDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tiempo de fin en segundos (opcional)', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInteractionDto.prototype, "endTime", void 0);
class CreateOverlayDto {
    constructor() {
        this.zIndex = 0;
    }
}
exports.CreateOverlayDto = CreateOverlayDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OverlayType, description: 'Tipo de overlay' }),
    (0, class_validator_1.IsEnum)(OverlayType),
    __metadata("design:type", String)
], CreateOverlayDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contenido del overlay (URL o HTML)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOverlayDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PositionDto, description: 'Posición del overlay' }),
    (0, class_transformer_1.Type)(() => PositionDto),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", PositionDto)
], CreateOverlayDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SizeDto, description: 'Tamaño del overlay' }),
    (0, class_transformer_1.Type)(() => SizeDto),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", SizeDto)
], CreateOverlayDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tiempo de inicio en segundos' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOverlayDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tiempo de fin en segundos (opcional)', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateOverlayDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Índice Z del overlay', default: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateOverlayDto.prototype, "zIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estilos CSS adicionales', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateOverlayDto.prototype, "styles", void 0);
class UpdateInteractionDto extends CreateInteractionDto {
}
exports.UpdateInteractionDto = UpdateInteractionDto;
class UpdateOverlayDto extends CreateOverlayDto {
}
exports.UpdateOverlayDto = UpdateOverlayDto;
//# sourceMappingURL=interactive.dto.js.map
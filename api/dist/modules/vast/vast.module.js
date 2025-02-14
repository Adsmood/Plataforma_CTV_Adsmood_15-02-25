"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VastModule = void 0;
const common_1 = require("@nestjs/common");
const vast_controller_1 = require("./vast.controller");
const vast_service_1 = require("./vast.service");
let VastModule = class VastModule {
};
exports.VastModule = VastModule;
exports.VastModule = VastModule = __decorate([
    (0, common_1.Module)({
        controllers: [vast_controller_1.VastController],
        providers: [vast_service_1.VastService],
        exports: [vast_service_1.VastService],
    })
], VastModule);
//# sourceMappingURL=vast.module.js.map
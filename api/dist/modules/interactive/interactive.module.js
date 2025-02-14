"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../prisma/prisma.module");
const interactive_controller_1 = require("./interactive.controller");
const interactive_service_1 = require("./interactive.service");
let InteractiveModule = class InteractiveModule {
};
exports.InteractiveModule = InteractiveModule;
exports.InteractiveModule = InteractiveModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [interactive_controller_1.InteractiveController],
        providers: [interactive_service_1.InteractiveService],
        exports: [interactive_service_1.InteractiveService],
    })
], InteractiveModule);
//# sourceMappingURL=interactive.module.js.map
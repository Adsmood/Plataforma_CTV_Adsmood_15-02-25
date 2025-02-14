"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const schedule_1 = require("@nestjs/schedule");
const tracking_controller_1 = require("./tracking.controller");
const tracking_service_1 = require("./tracking.service");
const config_1 = require("@nestjs/config");
let TrackingModule = class TrackingModule {
};
exports.TrackingModule = TrackingModule;
exports.TrackingModule = TrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register({
                ttl: 60 * 60 * 1000,
                max: 100,
            }),
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule,
        ],
        controllers: [tracking_controller_1.TrackingController],
        providers: [tracking_service_1.TrackingService],
        exports: [tracking_service_1.TrackingService],
    })
], TrackingModule);
//# sourceMappingURL=tracking.module.js.map
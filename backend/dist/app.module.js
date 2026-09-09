"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const specialties_module_1 = require("./specialties/specialties.module");
const doctors_module_1 = require("./doctors/doctors.module");
const appointments_module_1 = require("./appointments/appointments.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                },
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            specialties_module_1.SpecialtiesModule,
            doctors_module_1.DoctorsModule,
            appointments_module_1.AppointmentsModule,
            notifications_module_1.NotificationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3002',
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SaludPública Connect API')
        .setDescription('Sistema de Gestión de Turnos para Centros de Salud Públicos')
        .setVersion('1.0')
        .addTag('specialties', 'Gestión de Especialidades')
        .addTag('doctors', 'Gestión de Médicos')
        .addTag('appointments', 'Gestión de Turnos')
        .addTag('notifications', 'Sistema de Notificaciones')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map
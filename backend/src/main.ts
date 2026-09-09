import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('SaludPública Connect API')
    .setDescription('Sistema de Gestión de Turnos para Centros de Salud Públicos')
    .setVersion('1.0')
    .addTag('specialties', 'Gestión de Especialidades')
    .addTag('doctors', 'Gestión de Médicos')
    .addTag('appointments', 'Gestión de Turnos')
    .addTag('notifications', 'Sistema de Notificaciones')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api`);
}

bootstrap();

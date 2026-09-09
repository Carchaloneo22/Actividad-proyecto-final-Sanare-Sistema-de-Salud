import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Bull Queue (Redis)
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),

    // Application Modules
    PrismaModule,
    AuthModule,
    SpecialtiesModule,
    DoctorsModule,
    AppointmentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}

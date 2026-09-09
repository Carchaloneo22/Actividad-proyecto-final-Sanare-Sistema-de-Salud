import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailModule } from '../mail/mail.module';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    MailModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [NotificationsProcessor],
})
export class NotificationsModule {}

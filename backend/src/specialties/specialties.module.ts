import { Module } from '@nestjs/common';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';

@Module({
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService],
  exports: [SpecialtiesService],
})
export class SpecialtiesModule {}

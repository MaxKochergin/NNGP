import { Module } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { SpecializationsController } from './specializations.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [SpecializationsController],
  providers: [SpecializationsService, PrismaService],
  exports: [SpecializationsService],
})
export class SpecializationsModule {}

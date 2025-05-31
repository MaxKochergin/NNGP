import { Module } from '@nestjs/common';
import { LearningMaterialsService } from './learning-materials.service';
import { LearningMaterialsController } from './learning-materials.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [LearningMaterialsController],
  providers: [LearningMaterialsService, PrismaService],
  exports: [LearningMaterialsService],
})
export class LearningMaterialsModule {}

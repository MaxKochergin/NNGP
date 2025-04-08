import { Module } from '@nestjs/common';
import { TestAttemptsService } from './test-attempts.service';
import { TestAttemptsController } from './test-attempts.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [TestAttemptsController],
  providers: [TestAttemptsService, PrismaService],
  exports: [TestAttemptsService],
})
export class TestAttemptsModule {}

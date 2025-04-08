import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TestAttemptsService } from './test-attempts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('test-attempts')
export class TestAttemptsController {
  constructor(private readonly testAttemptsService: TestAttemptsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  async findAll(
    @Query('testId') testId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.testAttemptsService.findAll(testId, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  async findOne(@Param('id') id: string) {
    return this.testAttemptsService.findOne(id);
  }

  @Get('by-candidate/:candidateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  async findByCandidateId(@Param('candidateId') candidateId: string) {
    return this.testAttemptsService.findByCandidateId(candidateId);
  }

  @Get('stats/by-test/:testId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  async getTestStatistics(@Param('testId') testId: string) {
    return this.testAttemptsService.getTestStatistics(testId);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  create(@Body() createTestDto: any, @Request() req) {
    return this.testsService.create(createTestDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req, @Query('published') published?: string) {
    const isPublished = published === 'true';
    return this.testsService.findAllForUser(
      req.user.id,
      req.user.roles,
      isPublished,
    );
  }

  @Get('available-for-candidates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  findForCandidates() {
    return this.testsService.findForCandidates();
  }

  @Get('available-for-employees')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  findForEmployees() {
    return this.testsService.findForEmployees();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.testsService.findOneForUser(id, req.user.id, req.user.roles);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  update(@Param('id') id: string, @Body() updateTestDto: any) {
    return this.testsService.update(id, updateTestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  startTest(@Param('id') id: string, @Request() req) {
    return this.testsService.startTest(id, req.user.id);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  submitTest(@Param('id') id: string, @Body() answers: any, @Request() req) {
    return this.testsService.submitTest(id, req.user.id, answers);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a question' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() data: Prisma.QuestionCreateInput) {
    return this.questionsService.create(data);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple questions' })
  @ApiResponse({ status: 201, description: 'Questions created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createMany(@Body() data: Prisma.QuestionCreateManyInput[]) {
    return this.questionsService.createMany(data);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get questions count' })
  @ApiQuery({ name: 'testId', required: false })
  @ApiResponse({ status: 200, description: 'Questions count retrieved' })
  count(@Query('testId') testId?: string) {
    return this.questionsService.count(testId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'testId', required: false })
  @ApiResponse({ status: 200, description: 'Questions list retrieved' })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('testId') testId?: string,
  ) {
    return this.questionsService.findAll(
      skip ? parseInt(skip) : undefined,
      take ? parseInt(take) : undefined,
      testId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by ID' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question found' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update question' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  update(@Param('id') id: string, @Body() data: Prisma.QuestionUpdateInput) {
    return this.questionsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete question' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question deleted' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}

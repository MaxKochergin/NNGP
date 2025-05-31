import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LearningMaterialsService } from './learning-materials.service';
import { CreateLearningMaterialDto } from './dto/create-learning-material.dto';
import { UpdateLearningMaterialDto } from './dto/update-learning-material.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Learning Materials')
@Controller('learning-materials')
export class LearningMaterialsController {
  constructor(
    private readonly learningMaterialsService: LearningMaterialsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create learning material' })
  @ApiResponse({ status: 201, description: 'Learning material created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or specialization not found' })
  create(@Body() createLearningMaterialDto: CreateLearningMaterialDto) {
    return this.learningMaterialsService.create(createLearningMaterialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all learning materials' })
  @ApiQuery({ name: 'specializationId', required: false })
  @ApiResponse({ status: 200, description: 'List of learning materials' })
  findAll(@Query('specializationId') specializationId?: string) {
    return this.learningMaterialsService.findAll(specializationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get learning material by ID' })
  @ApiParam({ name: 'id', description: 'Learning material ID' })
  @ApiResponse({ status: 200, description: 'Learning material found' })
  @ApiResponse({ status: 404, description: 'Learning material not found' })
  findOne(@Param('id') id: string) {
    return this.learningMaterialsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update learning material' })
  @ApiParam({ name: 'id', description: 'Learning material ID' })
  @ApiResponse({ status: 200, description: 'Learning material updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Learning material or specialization not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateLearningMaterialDto: UpdateLearningMaterialDto,
  ) {
    return this.learningMaterialsService.update(id, updateLearningMaterialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete learning material' })
  @ApiParam({ name: 'id', description: 'Learning material ID' })
  @ApiResponse({ status: 200, description: 'Learning material deleted' })
  @ApiResponse({ status: 404, description: 'Learning material not found' })
  remove(@Param('id') id: string) {
    return this.learningMaterialsService.remove(id);
  }
}

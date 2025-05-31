import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { Specialization } from '@prisma/client';

@Controller('specializations')
export class SpecializationsController {
  constructor(
    private readonly specializationsService: SpecializationsService,
  ) {}

  @Post()
  async create(
    @Body() createSpecializationDto: CreateSpecializationDto,
  ): Promise<Specialization> {
    return this.specializationsService.create(createSpecializationDto);
  }

  @Get()
  async findAll(): Promise<Specialization[]> {
    return this.specializationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Specialization> {
    return this.specializationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSpecializationDto: UpdateSpecializationDto,
  ): Promise<Specialization> {
    return this.specializationsService.update(id, updateSpecializationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Specialization> {
    return this.specializationsService.remove(id);
  }
}

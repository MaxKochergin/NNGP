import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  async findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.findOne(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Profile> {
    return this.profilesService.findByUserId(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.remove(id);
  }
}

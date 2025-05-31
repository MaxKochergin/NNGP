import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateLearningMaterialDto } from './dto/create-learning-material.dto';
import { UpdateLearningMaterialDto } from './dto/update-learning-material.dto';
import { LearningMaterial, Prisma } from '@prisma/client';

@Injectable()
export class LearningMaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createLearningMaterialDto: CreateLearningMaterialDto,
  ): Promise<LearningMaterial> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createLearningMaterialDto.createdById },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createLearningMaterialDto.createdById} not found`,
      );
    }

    // Check if specialization exists
    const specialization = await this.prisma.specialization.findUnique({
      where: { id: createLearningMaterialDto.specializationId },
    });

    if (!specialization) {
      throw new NotFoundException(
        `Specialization with ID ${createLearningMaterialDto.specializationId} not found`,
      );
    }

    // Create data object for Prisma
    const data: Prisma.LearningMaterialCreateInput = {
      title: createLearningMaterialDto.title,
      content: createLearningMaterialDto.content,
      isPublished: createLearningMaterialDto.isPublished || false,
      specialization: {
        connect: { id: createLearningMaterialDto.specializationId },
      },
      createdBy: {
        connect: { id: createLearningMaterialDto.createdById },
      },
    };

    return this.prisma.learningMaterial.create({
      data,
    });
  }

  async findAll(specializationId?: string): Promise<LearningMaterial[]> {
    const where: Prisma.LearningMaterialWhereInput = {};

    if (specializationId) {
      where.specializationId = specializationId;
    }

    return this.prisma.learningMaterial.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        specialization: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<LearningMaterial> {
    const learningMaterial = await this.prisma.learningMaterial.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        specialization: true,
      },
    });

    if (!learningMaterial) {
      throw new NotFoundException(`Learning material with ID ${id} not found`);
    }

    return learningMaterial;
  }

  async update(
    id: string,
    updateLearningMaterialDto: UpdateLearningMaterialDto,
  ): Promise<LearningMaterial> {
    // Check if learning material exists
    await this.findOne(id);

    // Check specialization if provided
    if (updateLearningMaterialDto.specializationId) {
      const specialization = await this.prisma.specialization.findUnique({
        where: { id: updateLearningMaterialDto.specializationId },
      });

      if (!specialization) {
        throw new NotFoundException(
          `Specialization with ID ${updateLearningMaterialDto.specializationId} not found`,
        );
      }
    }

    // Create update data object
    const data: Prisma.LearningMaterialUpdateInput = {
      ...(updateLearningMaterialDto.title !== undefined && {
        title: updateLearningMaterialDto.title,
      }),
      ...(updateLearningMaterialDto.content !== undefined && {
        content: updateLearningMaterialDto.content,
      }),
      ...(updateLearningMaterialDto.isPublished !== undefined && {
        isPublished: updateLearningMaterialDto.isPublished,
      }),
      ...(updateLearningMaterialDto.specializationId !== undefined && {
        specialization: {
          connect: { id: updateLearningMaterialDto.specializationId },
        },
      }),
    };

    return this.prisma.learningMaterial.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<LearningMaterial> {
    // Check if learning material exists
    await this.findOne(id);

    return this.prisma.learningMaterial.delete({
      where: { id },
    });
  }
}

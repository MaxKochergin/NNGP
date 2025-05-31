import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { Specialization } from '@prisma/client';

@Injectable()
export class SpecializationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createSpecializationDto: CreateSpecializationDto,
  ): Promise<Specialization> {
    // Проверяем, существует ли специализация с таким именем
    const existingSpecialization = await this.prisma.specialization.findFirst({
      where: { name: createSpecializationDto.name },
    });

    if (existingSpecialization) {
      throw new ConflictException(
        `Специализация с названием "${createSpecializationDto.name}" уже существует`,
      );
    }

    return this.prisma.specialization.create({
      data: createSpecializationDto,
    });
  }

  async findAll(): Promise<Specialization[]> {
    return this.prisma.specialization.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Specialization> {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id },
      include: {
        profiles: true,
        specializationTests: {
          include: {
            test: true,
          },
        },
        learningMaterials: true,
      },
    });

    if (!specialization) {
      throw new NotFoundException(`Специализация с ID ${id} не найдена`);
    }

    return specialization;
  }

  async update(
    id: string,
    updateSpecializationDto: UpdateSpecializationDto,
  ): Promise<Specialization> {
    // Проверяем, существует ли специализация
    await this.findOne(id);

    // Если меняется имя, проверяем на уникальность
    if (updateSpecializationDto.name) {
      const existingSpecialization = await this.prisma.specialization.findFirst(
        {
          where: {
            name: updateSpecializationDto.name,
            id: { not: id },
          },
        },
      );

      if (existingSpecialization) {
        throw new ConflictException(
          `Специализация с названием "${updateSpecializationDto.name}" уже существует`,
        );
      }
    }

    return this.prisma.specialization.update({
      where: { id },
      data: updateSpecializationDto,
    });
  }

  async remove(id: string): Promise<Specialization> {
    // Проверяем, существует ли специализация
    await this.findOne(id);

    // Проверяем, используется ли специализация в профилях
    const profilesWithSpecialization = await this.prisma.profile.findFirst({
      where: { specializationId: id },
    });

    if (profilesWithSpecialization) {
      throw new ConflictException(
        'Невозможно удалить специализацию, так как она используется в профилях',
      );
    }

    // Проверяем, используется ли специализация в тестах
    const testsWithSpecialization =
      await this.prisma.specializationTest.findFirst({
        where: { specializationId: id },
      });

    if (testsWithSpecialization) {
      throw new ConflictException(
        'Невозможно удалить специализацию, так как она связана с тестами',
      );
    }

    // Проверяем, используется ли специализация в учебных материалах
    const materialsWithSpecialization =
      await this.prisma.learningMaterial.findFirst({
        where: { specializationId: id },
      });

    if (materialsWithSpecialization) {
      throw new ConflictException(
        'Невозможно удалить специализацию, так как она используется в учебных материалах',
      );
    }

    return this.prisma.specialization.delete({
      where: { id },
    });
  }
}

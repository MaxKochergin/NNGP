import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from '@prisma/client';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    // Проверяем, существует ли навык с таким именем
    const existingSkill = await this.prisma.skill.findFirst({
      where: { name: createSkillDto.name },
    });

    if (existingSkill) {
      throw new ConflictException(
        `Навык с названием "${createSkillDto.name}" уже существует`,
      );
    }

    return this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async findAll(category?: string): Promise<Skill[]> {
    if (category) {
      return this.prisma.skill.findMany({
        where: { category },
        orderBy: { name: 'asc' },
      });
    }
    return this.prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException(`Навык с ID ${id} не найден`);
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    // Проверяем, существует ли навык
    await this.findOne(id);

    // Если меняется имя, проверяем на уникальность
    if (updateSkillDto.name) {
      const existingSkill = await this.prisma.skill.findFirst({
        where: {
          name: updateSkillDto.name,
          id: { not: id },
        },
      });

      if (existingSkill) {
        throw new ConflictException(
          `Навык с названием "${updateSkillDto.name}" уже существует`,
        );
      }
    }

    return this.prisma.skill.update({
      where: { id },
      data: updateSkillDto,
    });
  }

  async remove(id: string): Promise<Skill> {
    // Проверяем, существует ли навык
    await this.findOne(id);

    // Проверяем, используется ли навык в профилях
    const profilesWithSkill = await this.prisma.profileSkill.findFirst({
      where: { skillId: id },
    });

    if (profilesWithSkill) {
      throw new ConflictException(
        'Невозможно удалить навык, так как он используется в профилях',
      );
    }

    return this.prisma.skill.delete({
      where: { id },
    });
  }
}

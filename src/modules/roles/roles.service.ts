import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Проверяем, существует ли роль с таким именем
    const existingRole = await this.prisma.role.findFirst({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException(
        `Роль с именем "${createRoleDto.name}" уже существует`,
      );
    }

    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Роль с ID ${id} не найдена`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Проверяем, существует ли роль
    await this.findOne(id);

    // Если меняется имя, проверяем на уникальность
    if (updateRoleDto.name) {
      const existingRole = await this.prisma.role.findFirst({
        where: {
          name: updateRoleDto.name,
          id: { not: id },
        },
      });

      if (existingRole) {
        throw new ConflictException(
          `Роль с именем "${updateRoleDto.name}" уже существует`,
        );
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: string): Promise<Role> {
    // Проверяем, существует ли роль
    await this.findOne(id);

    // Проверяем, используется ли роль пользователями
    const usersWithRole = await this.prisma.userRole.findFirst({
      where: { roleId: id },
    });

    if (usersWithRole) {
      throw new ConflictException(
        'Невозможно удалить роль, так как она используется пользователями',
      );
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }
}

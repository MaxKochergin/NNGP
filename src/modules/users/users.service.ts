import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    // Создаем пользователя в транзакции вместе с ролями
    return this.prisma.$transaction(async (tx) => {
      // Создаем пользователя
      const user = await tx.user.create({
        data: {
          email: createUserDto.email,
          passwordHash,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          phone: createUserDto.phone,
          dataProcessingConsent: createUserDto.dataProcessingConsent,
          emailVerified: false,
        },
      });

      // Если роли не указаны или массив пустой, добавляем роль "candidate"
      if (!createUserDto.roleIds || createUserDto.roleIds.length === 0) {
        // Находим роль "candidate"
        const candidateRole = await tx.role.findFirst({
          where: { name: 'candidate' },
        });

        if (candidateRole) {
          // Присваиваем роль кандидата
          await tx.userRole.create({
            data: {
              userId: user.id,
              roleId: candidateRole.id,
            },
          });
        }
      } else {
        // Если роли указаны, добавляем их как обычно
        await Promise.all(
          createUserDto.roleIds.map((roleId) =>
            tx.userRole.create({
              data: {
                userId: user.id,
                roleId,
              },
            }),
          ),
        );
      }

      return user;
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Проверяем, существует ли пользователь
    await this.findOne(id);

    // Подготавливаем данные для обновления
    const updateData: Prisma.UserUpdateInput = {
      ...(updateUserDto.firstName && { firstName: updateUserDto.firstName }),
      ...(updateUserDto.lastName && { lastName: updateUserDto.lastName }),
      ...(updateUserDto.phone !== undefined && { phone: updateUserDto.phone }),
      ...(updateUserDto.dataProcessingConsent !== undefined && {
        dataProcessingConsent: updateUserDto.dataProcessingConsent,
      }),
    };

    // Если указан новый пароль, хешируем его
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Обновляем пользователя в транзакции вместе с ролями
    return this.prisma.$transaction(async (tx) => {
      // Обновляем пользователя
      const updatedUser = await tx.user.update({
        where: { id },
        data: updateData,
      });

      // Если указаны роли для обновления
      if (updateUserDto.roleIds) {
        // Удаляем существующие роли
        await tx.userRole.deleteMany({
          where: { userId: id },
        });

        // Добавляем новые роли
        await Promise.all(
          updateUserDto.roleIds.map((roleId) =>
            tx.userRole.create({
              data: {
                userId: id,
                roleId,
              },
            }),
          ),
        );
      }

      return updatedUser;
    });
  }

  async remove(id: string): Promise<User> {
    // Проверяем, существует ли пользователь
    await this.findOne(id);

    // Удаляем пользователя
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    // Проверяем, существует ли пользователь
    await this.findOne(userId);

    // Обновляем роли пользователя в транзакции
    return this.prisma.$transaction(async (tx) => {
      // Удаляем существующие роли
      await tx.userRole.deleteMany({
        where: { userId },
      });

      // Добавляем новые роли
      await Promise.all(
        roleIds.map((roleId) =>
          tx.userRole.create({
            data: {
              userId,
              roleId,
            },
          }),
        ),
      );

      // Возвращаем обновленного пользователя
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error(`Пользователь с ID ${userId} не найден`);
      }

      return user;
    });
  }

  async getUserRoles(userId: string) {
    // Проверяем, существует ли пользователь
    await this.findOne(userId);

    // Получаем роли пользователя
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    return userRoles.map((ur) => ur.role);
  }
}

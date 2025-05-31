import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, Prisma } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({
      where: { id: createProfileDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Пользователь с ID ${createProfileDto.userId} не найден`,
      );
    }

    // Проверяем, существует ли специализация
    const specialization = await this.prisma.specialization.findUnique({
      where: { id: createProfileDto.specializationId },
    });

    if (!specialization) {
      throw new NotFoundException(
        `Специализация с ID ${createProfileDto.specializationId} не найдена`,
      );
    }

    // Проверяем, нет ли уже профиля у пользователя
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId: createProfileDto.userId },
    });

    if (existingProfile) {
      throw new ConflictException(
        `Профиль для пользователя с ID ${createProfileDto.userId} уже существует`,
      );
    }

    // Создаем профиль в транзакции вместе со связанными данными
    return this.prisma.$transaction(async (tx) => {
      // Создаем профиль
      const profile = await tx.profile.create({
        data: {
          userId: createProfileDto.userId,
          specializationId: createProfileDto.specializationId,
          aboutMe: createProfileDto.aboutMe,
          specialistLevel: createProfileDto.specialistLevel,
          location: createProfileDto.location,
          photoUrl: createProfileDto.photoUrl,
        },
      });

      // Добавляем социальные сети, если они указаны
      if (
        createProfileDto.socialMedia &&
        createProfileDto.socialMedia.length > 0
      ) {
        await Promise.all(
          createProfileDto.socialMedia.map((social) =>
            tx.socialMedia.create({
              data: {
                profileId: profile.id,
                platform: social.platform,
                url: social.url,
              },
            }),
          ),
        );
      }

      // Добавляем навыки, если они указаны
      if (createProfileDto.skills && createProfileDto.skills.length > 0) {
        await Promise.all(
          createProfileDto.skills.map((skill) =>
            tx.profileSkill.create({
              data: {
                profileId: profile.id,
                skillId: skill.skillId,
                level: skill.level,
              },
            }),
          ),
        );
      }

      return profile;
    });
  }

  async findAll(): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      include: {
        user: true,
        specialization: true,
        socialMedia: true,
        profileSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: true,
        specialization: true,
        socialMedia: true,
        profileSkills: {
          include: {
            skill: true,
          },
        },
        projects: true,
        workExperiences: true,
        educations: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Профиль с ID ${id} не найден`);
    }

    return profile;
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true,
        specialization: true,
        socialMedia: true,
        profileSkills: {
          include: {
            skill: true,
          },
        },
        projects: true,
        workExperiences: true,
        educations: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Профиль для пользователя с ID ${userId} не найден`,
      );
    }

    return profile;
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    // Проверяем, существует ли профиль
    await this.findOne(id);

    // Если указана специализация, проверяем её существование
    if (updateProfileDto.specializationId) {
      const specialization = await this.prisma.specialization.findUnique({
        where: { id: updateProfileDto.specializationId },
      });

      if (!specialization) {
        throw new NotFoundException(
          `Специализация с ID ${updateProfileDto.specializationId} не найдена`,
        );
      }
    }

    // Обновляем профиль в транзакции вместе со связанными данными
    return this.prisma.$transaction(async (tx) => {
      // Обновляем профиль
      const updatedProfile = await tx.profile.update({
        where: { id },
        data: {
          ...(updateProfileDto.specializationId && {
            specializationId: updateProfileDto.specializationId,
          }),
          ...(updateProfileDto.aboutMe !== undefined && {
            aboutMe: updateProfileDto.aboutMe,
          }),
          ...(updateProfileDto.specialistLevel !== undefined && {
            specialistLevel: updateProfileDto.specialistLevel,
          }),
          ...(updateProfileDto.location !== undefined && {
            location: updateProfileDto.location,
          }),
          ...(updateProfileDto.photoUrl !== undefined && {
            photoUrl: updateProfileDto.photoUrl,
          }),
        },
      });

      // Если указаны социальные сети, обновляем их
      if (updateProfileDto.socialMedia) {
        // Удаляем существующие социальные сети
        await tx.socialMedia.deleteMany({
          where: { profileId: id },
        });

        // Добавляем новые социальные сети
        await Promise.all(
          updateProfileDto.socialMedia.map((social) =>
            tx.socialMedia.create({
              data: {
                profileId: id,
                platform: social.platform,
                url: social.url,
              },
            }),
          ),
        );
      }

      // Если указаны навыки, обновляем их
      if (updateProfileDto.skills) {
        // Удаляем существующие навыки
        await tx.profileSkill.deleteMany({
          where: { profileId: id },
        });

        // Добавляем новые навыки
        await Promise.all(
          updateProfileDto.skills.map((skill) =>
            tx.profileSkill.create({
              data: {
                profileId: id,
                skillId: skill.skillId,
                level: skill.level,
              },
            }),
          ),
        );
      }

      return updatedProfile;
    });
  }

  async remove(id: string): Promise<Profile> {
    // Проверяем, существует ли профиль
    await this.findOne(id);

    // Удаляем связанные данные и профиль в транзакции
    return this.prisma.$transaction(async (tx) => {
      // Удаляем связанные данные
      await tx.socialMedia.deleteMany({ where: { profileId: id } });
      await tx.profileSkill.deleteMany({ where: { profileId: id } });
      await tx.project.deleteMany({ where: { profileId: id } });
      await tx.workExperience.deleteMany({ where: { profileId: id } });
      await tx.education.deleteMany({ where: { profileId: id } });

      // Удаляем профиль
      return tx.profile.delete({ where: { id } });
    });
  }
}

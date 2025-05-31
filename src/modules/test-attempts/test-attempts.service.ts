import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TestAttemptsService {
  constructor(private prisma: PrismaService) {}

  async findAll(testId?: string, userId?: string) {
    const where = {
      ...(testId && { testId }),
      ...(userId && { userId }),
    };

    return this.prisma.testAttempt.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        test: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const testAttempt = await this.prisma.testAttempt.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        test: true,
        userAnswers: {
          include: {
            question: true,
            selectedOption: true,
          },
        },
      },
    });

    if (!testAttempt) {
      throw new NotFoundException(`Попытка теста с ID ${id} не найдена`);
    }

    return testAttempt;
  }

  async findByCandidateId(candidateId: string) {
    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({
      where: { id: candidateId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${candidateId} не найден`);
    }

    // Получаем роли пользователя
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: candidateId },
      include: { role: true },
    });

    // Проверяем, является ли пользователь кандидатом
    const isCandidate = userRoles.some((ur) => ur.role.name === 'candidate');

    if (!isCandidate) {
      throw new NotFoundException(
        `Пользователь с ID ${candidateId} не является кандидатом`,
      );
    }

    return this.prisma.testAttempt.findMany({
      where: { userId: candidateId },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        userAnswers: {
          select: {
            id: true,
            isCorrect: true,
            scoreAwarded: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTestStatistics(testId: string) {
    // Проверяем, существует ли тест
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
    });

    if (!test) {
      throw new NotFoundException(`Тест с ID ${testId} не найден`);
    }

    const attempts = await this.prisma.testAttempt.findMany({
      where: { testId },
      select: {
        id: true,
        score: true,
        status: true,
        startTime: true,
        endTime: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Вычисляем статистику
    const completedAttempts = attempts.filter(
      (a) => a.status === 'COMPLETED' && a.score !== null,
    );

    const statistics = {
      totalAttempts: attempts.length,
      completedAttempts: completedAttempts.length,
      avgScore: completedAttempts.length
        ? completedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) /
          completedAttempts.length
        : 0,
      maxScore: completedAttempts.length
        ? Math.max(...completedAttempts.map((a) => a.score || 0))
        : 0,
      minScore: completedAttempts.length
        ? Math.min(...completedAttempts.map((a) => a.score || 0))
        : 0,
      recentAttempts: attempts.slice(0, 10),
    };

    return statistics;
  }
}

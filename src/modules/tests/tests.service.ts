import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test, Prisma, Question, AnswerOption } from '@prisma/client';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async create(createTestDto: CreateTestDto, userId: string): Promise<Test> {
    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    // Создаем тест в транзакции вместе со связями к специализациям
    return this.prisma.$transaction(async (tx) => {
      // Создаем тест
      const test = await tx.test.create({
        data: {
          title: createTestDto.title,
          description: createTestDto.description,
          durationMinutes: createTestDto.durationMinutes,
          isPublished: createTestDto.isPublished || false,
          createdById: userId,
        },
      });

      // Добавляем связи со специализациями, если они указаны
      if (
        createTestDto.specializationIds &&
        Array.isArray(createTestDto.specializationIds) &&
        createTestDto.specializationIds.length > 0
      ) {
        const promises: Promise<any>[] = [];

        for (const specializationId of createTestDto.specializationIds) {
          if (typeof specializationId === 'string') {
            promises.push(
              tx.specializationTest.create({
                data: {
                  testId: test.id,
                  specializationId,
                  isRequired: false,
                },
              }) as any,
            );
          }
        }

        await Promise.all(promises);
      }

      return test;
    });
  }

  async findAll(
    specializationId?: string,
    isPublished?: boolean,
  ): Promise<Test[]> {
    // Базовые параметры запроса
    const where: Prisma.TestWhereInput = {};

    // Добавляем фильтрацию по флагу публикации, если он указан
    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    // Если указан ID специализации, ищем тесты, связанные с этой специализацией
    if (specializationId) {
      return this.prisma.test.findMany({
        where: {
          ...where,
          specializationTests: {
            some: {
              specializationId,
            },
          },
        },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          questions: {
            select: {
              id: true,
              content: true,
              type: true,
            },
          },
          specializationTests: {
            include: {
              specialization: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Если специализация не указана, возвращаем все тесты
    return this.prisma.test.findMany({
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
        questions: {
          select: {
            id: true,
            content: true,
            type: true,
          },
        },
        specializationTests: {
          include: {
            specialization: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Test> {
    const test = await this.prisma.test.findUnique({
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
        questions: {
          include: {
            answerOptions: true,
          },
        },
        specializationTests: {
          include: {
            specialization: true,
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException(`Тест с ID ${id} не найден`);
    }

    return test;
  }

  async update(id: string, updateTestDto: UpdateTestDto): Promise<Test> {
    // Проверяем, существует ли тест
    await this.findOne(id);

    // Обновляем тест в транзакции вместе со связями к специализациям
    return this.prisma.$transaction(async (tx) => {
      // Обновляем тест
      const updatedTest = await tx.test.update({
        where: { id },
        data: {
          ...(updateTestDto.title !== undefined && {
            title: updateTestDto.title,
          }),
          ...(updateTestDto.description !== undefined && {
            description: updateTestDto.description,
          }),
          ...(updateTestDto.durationMinutes !== undefined && {
            durationMinutes: updateTestDto.durationMinutes,
          }),
          ...(updateTestDto.isPublished !== undefined && {
            isPublished: updateTestDto.isPublished,
          }),
        },
      });

      // Если указаны специализации, обновляем их
      if (
        updateTestDto.specializationIds &&
        Array.isArray(updateTestDto.specializationIds)
      ) {
        // Удаляем существующие связи
        await tx.specializationTest.deleteMany({
          where: { testId: id },
        });

        // Добавляем новые связи с использованием того же подхода, что и в create
        const promises: Promise<any>[] = [];

        for (const specializationId of updateTestDto.specializationIds) {
          if (typeof specializationId === 'string') {
            promises.push(
              tx.specializationTest.create({
                data: {
                  testId: id,
                  specializationId,
                  isRequired: false,
                },
              }) as any,
            );
          }
        }

        await Promise.all(promises);
      }

      return updatedTest;
    });
  }

  async remove(id: string): Promise<Test> {
    // Проверяем, существует ли тест
    await this.findOne(id);

    // Проверяем, есть ли попытки прохождения теста
    const testAttempts = await this.prisma.testAttempt.findFirst({
      where: { testId: id },
    });

    if (testAttempts) {
      throw new ConflictException(
        'Невозможно удалить тест, так как есть попытки его прохождения',
      );
    }

    // Удаляем связанные данные и тест в транзакции
    return this.prisma.$transaction(async (tx) => {
      // Удаляем связи со специализациями
      await tx.specializationTest.deleteMany({
        where: { testId: id },
      });

      // Удаляем вопросы теста и связанные с ними варианты ответов
      const questions = await tx.question.findMany({
        where: { testId: id },
        select: { id: true },
      });

      // Удаляем варианты ответов для каждого вопроса
      for (const question of questions) {
        await tx.answerOption.deleteMany({
          where: { questionId: question.id },
        });
      }

      // Удаляем сами вопросы
      await tx.question.deleteMany({
        where: { testId: id },
      });

      // Удаляем тест
      return tx.test.delete({
        where: { id },
      });
    });
  }

  async findAllForUser(
    userId: string,
    userRoles: string[],
    isPublished?: boolean,
  ): Promise<any[]> {
    // Базовые параметры запроса
    const where: Prisma.TestWhereInput = {};

    // Если пользователь не админ или HR, показываем только опубликованные тесты
    if (!userRoles.some((role) => ['admin', 'hr'].includes(role))) {
      where.isPublished = true;
    } else if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    // Для кандидатов показываем только тесты для кандидатов
    if (userRoles.includes('candidate')) {
      const tests = await this.findForCandidates();

      // Получаем попытки теста для этого пользователя
      const testAttempts = await this.prisma.testAttempt.findMany({
        where: { userId },
        select: {
          testId: true,
          status: true,
          score: true,
        },
      });

      // Добавляем информацию о попытках к тестам
      return tests.map((test) => ({
        ...test,
        attempt:
          testAttempts.find((attempt) => attempt.testId === test.id) || null,
      }));
    }

    // Для сотрудников показываем только тесты для сотрудников
    if (userRoles.includes('employee')) {
      const tests = await this.findForEmployees();

      // Получаем попытки теста для этого пользователя
      const testAttempts = await this.prisma.testAttempt.findMany({
        where: { userId },
        select: {
          testId: true,
          status: true,
          score: true,
        },
      });

      // Добавляем информацию о попытках к тестам
      return tests.map((test) => ({
        ...test,
        attempt:
          testAttempts.find((attempt) => attempt.testId === test.id) || null,
      }));
    }

    // Для админов и HR возвращаем все тесты
    return this.prisma.test.findMany({
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
        questions: {
          select: {
            id: true,
            content: true,
            type: true,
          },
        },
        specializationTests: {
          include: {
            specialization: true,
          },
        },
        testAttempts: {
          where: { userId },
          select: {
            id: true,
            status: true,
            score: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneForUser(
    id: string,
    userId: string,
    userRoles: string[],
  ): Promise<any> {
    const test = await this.findOne(id);

    // Если пользователь не админ или HR и тест не опубликован, запрещаем доступ
    if (
      !userRoles.some((role) => ['admin', 'hr'].includes(role)) &&
      !test.isPublished
    ) {
      throw new NotFoundException(`Тест с ID ${id} не найден или недоступен`);
    }

    // Получаем попытки теста для этого пользователя
    const testAttempts = await this.prisma.testAttempt.findMany({
      where: { testId: id, userId },
      orderBy: { createdAt: 'desc' },
    });

    // Возвращаем тест с информацией о попытках
    return {
      ...test,
      attempts: testAttempts,
    };
  }

  async findForCandidates(): Promise<any[]> {
    // Находим тесты, предназначенные для кандидатов
    // Здесь можно добавить дополнительную логику для определения, какие тесты доступны кандидатам
    return this.prisma.test.findMany({
      where: {
        isPublished: true,
        // Можно добавить дополнительные критерии, например, наличие тега или категории "для кандидатов"
      },
      include: {
        questions: {
          select: {
            id: true,
            content: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findForEmployees(): Promise<any[]> {
    // Находим тесты, предназначенные для сотрудников
    // Здесь можно добавить дополнительную логику для определения, какие тесты доступны сотрудникам
    return this.prisma.test.findMany({
      where: {
        isPublished: true,
        // Можно добавить дополнительные критерии, например, наличие тега или категории "для сотрудников"
      },
      include: {
        questions: {
          select: {
            id: true,
            content: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async startTest(testId: string, userId: string): Promise<any> {
    // Проверяем, существует ли тест
    const test = await this.findOne(testId);

    // Проверяем, есть ли незавершенные попытки этого теста у пользователя
    const existingAttempt = await this.prisma.testAttempt.findFirst({
      where: {
        testId,
        userId,
        status: 'IN_PROGRESS',
      },
    });

    if (existingAttempt) {
      return existingAttempt;
    }

    // Создаем новую попытку теста
    return this.prisma.testAttempt.create({
      data: {
        testId,
        userId,
        startTime: new Date(),
        status: 'IN_PROGRESS',
      },
    });
  }

  async submitTest(
    testId: string,
    userId: string,
    answers: any[],
  ): Promise<any> {
    // Находим незавершенную попытку теста
    const testAttempt = await this.prisma.testAttempt.findFirst({
      where: {
        testId,
        userId,
        status: 'IN_PROGRESS',
      },
    });

    if (!testAttempt) {
      throw new NotFoundException('Активная попытка теста не найдена');
    }

    // Получаем тест с вопросами
    const testWithQuestions = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            answerOptions: true,
          },
        },
      },
    });

    if (!testWithQuestions) {
      throw new NotFoundException(`Тест с ID ${testId} не найден`);
    }

    const questions = testWithQuestions.questions;

    // Обрабатываем ответы и вычисляем оценку
    const totalScore = await this.processAnswers(
      testAttempt.id,
      answers,
      questions,
    );

    // Обновляем попытку теста
    return this.prisma.testAttempt.update({
      where: { id: testAttempt.id },
      data: {
        endTime: new Date(),
        status: 'COMPLETED',
        score: totalScore,
      },
      include: {
        test: {
          select: {
            title: true,
            description: true,
          },
        },
        userAnswers: {
          include: {
            question: true,
            selectedOption: true,
          },
        },
      },
    });
  }

  private async processAnswers(
    testAttemptId: string,
    answers: any[],
    questions: (Question & { answerOptions: AnswerOption[] })[],
  ): Promise<number> {
    let totalScore = 0;

    // Если questions не определен или пуст, получаем их из базы данных
    if (!questions || questions.length === 0) {
      const testAttempt = await this.prisma.testAttempt.findUnique({
        where: { id: testAttemptId },
        include: { test: { select: { id: true } } },
      });

      if (testAttempt?.test?.id) {
        questions = await this.prisma.question.findMany({
          where: { testId: testAttempt.test.id },
          include: { answerOptions: true },
        });
      }
    }

    // Обрабатываем каждый ответ
    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);

      if (!question) continue;

      let isCorrect = false;
      let scoreAwarded = 0;

      // Проверяем правильность ответа в зависимости от типа вопроса
      if (
        question.type === 'SINGLE_CHOICE' ||
        question.type === 'MULTIPLE_CHOICE'
      ) {
        // Для выбора одного или нескольких вариантов
        if (
          answer.selectedOptionId &&
          question.answerOptions &&
          Array.isArray(question.answerOptions)
        ) {
          let option: AnswerOption | undefined = undefined;

          // Безопасный поиск опции
          for (const opt of question.answerOptions) {
            if (opt && opt.id === answer.selectedOptionId) {
              option = opt;
              break;
            }
          }

          isCorrect = option?.isCorrect || false;

          // Присваиваем баллы, если ответ правильный
          if (isCorrect && question.score) {
            scoreAwarded = question.score;
            totalScore += scoreAwarded;
          }
        }
      } else if (question.type === 'TEXT') {
        // Для текстовых ответов можно реализовать автоматическую проверку
        // или оставить для ручной проверки
        // В данной реализации просто сохраняем ответ без оценки
      }

      // Сохраняем ответ пользователя
      await this.prisma.userAnswer.create({
        data: {
          testAttemptId,
          questionId: question.id,
          selectedOptionId: answer.selectedOptionId,
          textAnswer: answer.textAnswer,
          isCorrect,
          scoreAwarded,
        },
      });
    }

    // Вычисляем процент правильных ответов
    const maxPossibleScore = questions.reduce(
      (sum, q) => sum + (q.score || 0),
      0,
    );

    if (maxPossibleScore > 0) {
      return (totalScore / maxPossibleScore) * 100;
    }

    return 0;
  }
}

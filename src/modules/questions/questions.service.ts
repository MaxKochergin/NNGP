import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Question, Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.QuestionCreateInput): Promise<Question> {
    if (data.test) {
      // Test module check removed as test module has been removed
      // Additional logic can be added if needed
    }

    return this.prisma.question.create({
      data,
    });
  }

  async createMany(
    data: Prisma.QuestionCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.question.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAll(
    skip?: number,
    take?: number,
    testId?: string,
  ): Promise<Question[]> {
    const where: Prisma.QuestionWhereInput = {};
    if (testId) {
      where.testId = testId;
    }

    return this.prisma.question.findMany({
      where,
      skip,
      take,
      include: {
        answerOptions: true,
      },
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        answerOptions: true,
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(
    id: string,
    data: Prisma.QuestionUpdateInput,
  ): Promise<Question> {
    try {
      return await this.prisma.question.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Question> {
    try {
      // First delete all answer options for the question
      await this.prisma.answerOption.deleteMany({
        where: { questionId: id },
      });

      // Then delete the question itself
      return await this.prisma.question.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }
      throw error;
    }
  }

  async count(testId?: string): Promise<number> {
    const where: Prisma.QuestionWhereInput = {};
    if (testId) {
      where.testId = testId;
    }

    return this.prisma.question.count({
      where,
    });
  }
}

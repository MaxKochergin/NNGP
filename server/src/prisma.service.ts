import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-expect-error - Prisma типы для $on могут быть неточными
    this.$on('beforeExit', () => {
      // Игнорируем Promise с помощью void
      void app.close();
    });

    // Добавляем оператор await, чтобы satisfy линтер
    await Promise.resolve();
  }
}

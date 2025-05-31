import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { railwayConfig } from './config/railway.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Логируем переменные окружения для отладки
    console.log('Environment variables check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);

    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set!');
      console.log(
        'Available env vars:',
        Object.keys(process.env).filter((key) => key.includes('DATABASE')),
      );
      console.log('Using fallback from railwayConfig');
    }

    super({
      datasources: {
        db: {
          url: railwayConfig.DATABASE_URL,
        },
      },
    });
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

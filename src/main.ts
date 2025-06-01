// Загружаем .env файл ПЕРВЫМ делом
import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Логируем все переменные окружения для отладки Railway
  console.log('=== Environment Variables Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log(
    'DATABASE_URL value:',
    process.env.DATABASE_URL ? 'SET' : 'NOT SET',
  );
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
  console.log(
    'All env vars with DATABASE:',
    Object.keys(process.env).filter((key) => key.includes('DATABASE')),
  );
  console.log('Total env vars count:', Object.keys(process.env).length);
  console.log('===================================');

  const app = await NestFactory.create(AppModule);

  // CORS configuration - временно разрешаем все origins для отладки
  app.enableCors({
    origin: true, // Разрешить все origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  console.log('CORS: разрешены ВСЕ origins для отладки');

  // Global API prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NNGP API')
    .setDescription(
      'API for Neural Network Generation of Professional Trajectories system',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application started on port ${process.env.PORT || 3000}`);
}
void bootstrap();

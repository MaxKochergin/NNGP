// Загружаем .env файл ПЕРВЫМ делом
import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
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

    console.log('🚀 Creating NestJS application...');
    const app = await NestFactory.create(AppModule);
    console.log('✅ NestJS application created successfully');

    // CORS configuration - временно разрешаем все origins для отладки
    console.log('🔧 Configuring CORS...');
    app.enableCors({
      origin: true, // Разрешить все origins
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    console.log('✅ CORS configured: all origins allowed');

    // Global API prefix
    console.log('🔧 Setting global prefix...');
    app.setGlobalPrefix('api');
    console.log('✅ Global prefix set to /api');

    // Swagger configuration
    console.log('📚 Setting up Swagger...');
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
    console.log('✅ Swagger setup complete at /api/docs');

    const port = process.env.PORT || 3000;
    console.log(`🚀 Starting server on port ${port}...`);

    await app.listen(port, '0.0.0.0');
    console.log(`🎉 Application successfully started on port ${port}`);
    console.log(
      `�� API Documentation: https://diplomatic-determination-production.up.railway.app/api/docs`,
    );
    console.log(
      `🌐 Health check: https://diplomatic-determination-production.up.railway.app/api`,
    );
    console.log(
      `🔗 Base URL: https://diplomatic-determination-production.up.railway.app`,
    );
  } catch (error) {
    console.error('💥 Failed to start application:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

void bootstrap();

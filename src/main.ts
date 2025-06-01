import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Логируем все переменные окружения для отладки Railway
  console.log('=== Environment Variables Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
  console.log(
    'All env vars with DATABASE:',
    Object.keys(process.env).filter((key) => key.includes('DATABASE')),
  );
  console.log('Total env vars count:', Object.keys(process.env).length);
  console.log('===================================');

  const app = await NestFactory.create(AppModule);

  // CORS configuration
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://nngp.vercel.app',
    process.env.CORS_ORIGIN,
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  console.log('CORS allowed origins:', allowedOrigins);

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

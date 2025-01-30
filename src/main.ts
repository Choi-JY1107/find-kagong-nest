import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: '*', // 모든 도메인 허용 (필요 시 특정 도메인만 허용 가능)
    methods: 'GET,POST,PUT,DELETE', // 허용할 HTTP 메서드
    allowedHeaders: 'Content-Type, Authorization', // 허용할 헤더
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CafeModule } from './cafe/cafe.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 환경 변수 설정
    CafeModule,
  ],
})
export class AppModule {}
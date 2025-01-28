import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CafeModule } from './cafe/cafe.module';

@Module({
  imports: [CafeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

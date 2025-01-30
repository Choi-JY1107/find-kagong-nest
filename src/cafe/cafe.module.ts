import { Module } from '@nestjs/common';
import { CafeController } from './cafe.controller';
import { CafeService } from './cafe.service';
import { GoogleMapsService } from './google-maps.service';

@Module({
  controllers: [CafeController],
  providers: [CafeService, GoogleMapsService]
})
export class CafeModule {}

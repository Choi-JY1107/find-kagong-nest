import { Controller, Post, Body } from '@nestjs/common';
import { FindListDto } from './cafe.dto';
import { CafeService } from './cafe.service';

@Controller('cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Post('find-list')
  async findList(@Body() findListDto: FindListDto) {
    const { minLon, minLat, maxLon, maxLat } = findListDto;

    const cafes = await this.cafeService.findCafes(minLat, minLon, maxLat, maxLon);

    return { message: '카페 검색 완료', cafes };
  }
}
import { Controller, Post, Body } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { FindListRequestDTO, FindListResponseDTO } from './cafe.dto';

@Controller('cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Post('find-list')
  async findList(@Body() findListDto: FindListRequestDTO): Promise<FindListResponseDTO[]> {
    const { minLon, minLat, maxLon, maxLat } = findListDto;
    return this.cafeService.findCafes(minLat, minLon, maxLat, maxLon);
  }
}
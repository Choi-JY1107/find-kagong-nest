import { Injectable } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { FindListResponseDTO } from './cafe.dto';

@Injectable()
export class CafeService {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  async findCafes(minLat: number, minLon: number, maxLat: number, maxLon: number): Promise<FindListResponseDTO[]> {
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    // 1️⃣ 주변 카페 리스트 가져오기
    const cafes = await this.googleMapsService.searchNearbyCafes(centerLat, centerLon);

    // 2️⃣ 각 카페의 영업 시간 추가
    const detailedCafes = await Promise.all(
      cafes.map(async (cafe: any) => ({
        ...cafe,
        openingHours: await this.googleMapsService.getCafeOpeningHours(cafe.placeId),
      })),
    );

    return detailedCafes;
  }
}
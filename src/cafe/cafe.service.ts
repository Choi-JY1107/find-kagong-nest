import { Injectable } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { FindListResponseDTO } from './cafe.dto';
import { calculateRadius } from '../utils/geo.util';

@Injectable()
export class CafeService {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  async findCafes(minLat: number, minLon: number, maxLat: number, maxLon: number): Promise<FindListResponseDTO[]> {
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    // ✅ 반경 계산 유틸 호출
    const radius = calculateRadius(minLat, minLon, maxLat, maxLon);

    // 1️⃣ 주변 카페 리스트 가져오기
    const cafeList = await this.googleMapsService.searchNearbyCafes(centerLat, centerLon, radius);

    // 2️⃣ 각 카페의 영업 시간 추가
    for(const cafe of cafeList) {
      cafe.openingHours = await this.googleMapsService.getCafeOpeningHours(cafe.placeId);
    }

    return cafeList;
  }
}
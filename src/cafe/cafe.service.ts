import { Injectable } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { FindListResponseDTO } from './cafe.dto';
import { getDistance } from 'geolib';

@Injectable()
export class CafeService {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  async findCafes(minLat: number, minLon: number, maxLat: number, maxLon: number): Promise<FindListResponseDTO[]> {
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    // 위도와 경도를 각각 거리(m)로 변환하여 비교
    const latDistance = getDistance({ latitude: minLat, longitude: centerLon }, { latitude: maxLat, longitude: centerLon });
    const lonDistance = getDistance({ latitude: centerLat, longitude: minLon }, { latitude: centerLat, longitude: maxLon });

    // 더 긴 거리를 반경으로 설정
    let radius = Math.max(latDistance, lonDistance);
    radius = Math.min(Math.max(radius, 500), 5000); // 최소 500m, 최대 5000m 제한

    // 1️⃣ 주변 카페 리스트 가져오기
    const cafes = await this.googleMapsService.searchNearbyCafes(centerLat, centerLon, radius);

    // 2️⃣ 각 카페의 영업 시간 추가
    const detailedCafes = await Promise.all(
      cafes.map(async (cafe) => ({
        ...cafe,
        openingHours: await this.googleMapsService.getCafeOpeningHours(cafe.placeId),
      })),
    );

    return detailedCafes;
  }
}
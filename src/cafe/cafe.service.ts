import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CafeService {
  private readonly googleApiKey = process.env.GOOGLE_API_KEY;

  async findCafes(minLat: number, minLon: number, maxLat: number, maxLon: number) {
    // 중앙 좌표 계산
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    // Google Places API 요청 URL
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = {
      location: `${centerLat},${centerLon}`,
      radius: 5000, // 반경 5km
      keyword: '카페',
      key: this.googleApiKey,
    };

    try {
      const response = await axios.get(url, { params });

      // 카페 리스트에서 이름과 영업 시간 추출
      const cafes = response.data.results.map((cafe) => ({
        name: cafe.name,
        address: cafe.vicinity,
        openNow: cafe.opening_hours?.open_now ?? '정보 없음',
      }));

      return cafes;
    } catch (error) {
      throw new HttpException(
        'Google Places API 요청 중 오류가 발생했습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
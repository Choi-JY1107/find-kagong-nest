import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleMapsService {
  private readonly googleApiKey = process.env.GOOGLE_API_KEY;

  /**
   * 주변 카페 검색
   * @param lat 중앙 위도
   * @param lon 중앙 경도
   * @returns 주변 카페 목록 (기본 정보만 포함)
   */
  async searchNearbyCafes(lat: number, lon: number) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = {
      location: `${lat},${lon}`,
      radius: 5000, // 반경 5km
      keyword: '카페',
      key: this.googleApiKey,
    };

    try {
      const response = await axios.get(url, { params });
      return response.data.results.map((cafe: any) => ({
        name: cafe.name,
        address: cafe.vicinity,
        lat: cafe.geometry.location.lat,
        lon: cafe.geometry.location.lng,
        openNow: cafe.opening_hours?.open_now ?? '정보 없음',
        placeId: cafe.place_id, // 상세 정보 조회를 위해 저장
      }));
    } catch (error) {
      throw new HttpException(
        'Google Places API 요청 중 오류가 발생했습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 특정 카페의 영업 시간 조회
   * @param placeId Google Places API의 place_id
   * @returns 요일별 영업 시간 (없으면 '정보 없음')
   */
  async getCafeOpeningHours(placeId: string) {
    if (!placeId) return '정보 없음';

    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    const params = {
      place_id: placeId,
      fields: 'opening_hours',
      key: this.googleApiKey,
    };

    try {
      const response = await axios.get(url, { params });
      return response.data.result?.opening_hours?.weekday_text || '정보 없음';
    } catch (error) {
      console.error(`상세 정보 요청 실패 (placeId: ${placeId})`, error);
      return '정보 없음';
    }
  }
}
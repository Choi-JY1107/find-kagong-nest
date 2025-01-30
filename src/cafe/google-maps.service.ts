import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import {
  GOOGLE_PLACES_NEARBY_SEARCH,
  GOOGLE_PLACES_DETAILS,
  PLACE_FIELDS,
  DEFAULT_OPENING_HOURS,
} from './cafe.constants';

@Injectable()
export class GoogleMapsService {
  private readonly googleApiKey = process.env.GOOGLE_API_KEY;

  /**
   * 주변 카페 검색 (radius를 인자로 받음)
   * @param lat 중앙 위도
   * @param lon 중앙 경도
   * @param radius 검색 반경 (미터 단위)
   * @returns 주변 카페 목록 (기본 정보만 포함)
   */
  async searchNearbyCafes(lat: number, lon: number, radius: number) {
    const params = {
      location: `${lat},${lon}`,
      radius, // 동적으로 전달된 반경 값 사용
      keyword: '카페',
      key: this.googleApiKey,
    };

    try {
      const response = await axios.get(GOOGLE_PLACES_NEARBY_SEARCH, { params });
      return response.data.results.map((cafe: any) => ({
        name: cafe.name,
        address: cafe.vicinity,
        lat: cafe.geometry.location.lat,
        lon: cafe.geometry.location.lng,
        openNow: cafe.opening_hours?.open_now ?? DEFAULT_OPENING_HOURS,
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
    if (!placeId) return DEFAULT_OPENING_HOURS;

    const params = {
      place_id: placeId,
      fields: PLACE_FIELDS,
      key: this.googleApiKey,
    };

    try {
      const response = await axios.get(GOOGLE_PLACES_DETAILS, { params });
      return response.data.result?.opening_hours?.weekday_text || DEFAULT_OPENING_HOURS;
    } catch (error) {
      console.error(`상세 정보 요청 실패 (placeId: ${placeId})`, error);
      return DEFAULT_OPENING_HOURS;
    }
  }
}
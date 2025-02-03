import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import {
  GOOGLE_PLACES_NEARBY_SEARCH,
  GOOGLE_PLACES_DETAILS,
  PLACE_FIELDS,
  GOOGLE_API_ERROR_MESSAGE,
  DEFAULT_OPENING_HOURS,
} from './cafe.constants';
import { CafeInfoDTO, CafeStoreHoursDTO } from './cafe.dto';

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
      radius,
      keyword: '카페',
      key: this.googleApiKey,
      language: 'ko',
    };

    try {
      const response = await axios.get(GOOGLE_PLACES_NEARBY_SEARCH, { params });
      return response.data.results.map((cafe: any) => new CafeInfoDTO(cafe));
    } catch (error) {
      throw new HttpException(
        GOOGLE_API_ERROR_MESSAGE,
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
    // TODO 에러 메세지로 만들것
    if (!placeId) return DEFAULT_OPENING_HOURS;

    const params = {
      place_id: placeId!,
      fields: PLACE_FIELDS,
      key: this.googleApiKey,
      language: 'ko',
    };

    try {
      const response = await axios.get(GOOGLE_PLACES_DETAILS, { params });
      if(!response.data.result.opening_hours) return DEFAULT_OPENING_HOURS;
      return response.data.result.opening_hours.weekday_text.map((day_text: string) => new CafeStoreHoursDTO(day_text));
    } catch (error) {
      console.error(`상세 정보 요청 실패 (placeId: ${placeId})`, error);
      return DEFAULT_OPENING_HOURS;
    }
  }
}
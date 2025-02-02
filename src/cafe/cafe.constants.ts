// URL 관련 상수
export const GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// Google Places API 관련 상수
export const PLACE_FIELDS = 'opening_hours';
export const DEFAULT_OPENING_HOURS = '정보 없음';
export const GOOGLE_PLACES_NEARBY_SEARCH = `${GOOGLE_MAPS_BASE_URL}/nearbysearch/json`;
export const GOOGLE_PLACES_DETAILS = `${GOOGLE_MAPS_BASE_URL}/details/json`;
export const PLACE_24_HOURS = '24 hours';

// Error Messages
export const GOOGLE_API_ERROR_MESSAGE = 'Google Places API 요청 중 오류가 발생했습니다.';
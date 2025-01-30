import { getDistance } from 'geolib';

/**
 * 위경도 좌표를 기반으로 검색 반경(radius)을 계산하는 함수
 * @param minLat 최소 위도
 * @param minLon 최소 경도
 * @param maxLat 최대 위도
 * @param maxLon 최대 경도
 * @returns 반경 (미터 단위)
 */
export function calculateRadius(minLat: number, minLon: number, maxLat: number, maxLon: number): number {
  // 위도와 경도를 각각 거리(m)로 변환하여 비교
  const latDistance = getDistance({ latitude: minLat, longitude: (minLon + maxLon) / 2 }, { latitude: maxLat, longitude: (minLon + maxLon) / 2 });
  const lonDistance = getDistance({ latitude: (minLat + maxLat) / 2, longitude: minLon }, { latitude: (minLat + maxLat) / 2, longitude: maxLon });

  // 더 긴 거리를 반경으로 설정
  let radius = Math.max(latDistance, lonDistance);
  return Math.min(Math.max(radius, 500), 5000); // 최소 500m, 최대 5000m 제한
}
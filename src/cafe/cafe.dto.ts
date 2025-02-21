import { IsNumber } from 'class-validator';
import { DEFAULT_OPENING_HOURS, PLACE_24_HOURS } from './cafe.constants';

export class FindListRequestDTO {
  @IsNumber()
  minLon: number;

  @IsNumber()
  minLat: number;

  @IsNumber()
  maxLon: number;

  @IsNumber()
  maxLat: number;
}

export class FindListResponseDTO {
  cafeInfo: CafeInfoDTO;
  cafeStoreHours: CafeStoreHoursDTO[];
}

export class CafeInfoDTO {
  name: string;
  address: string;
  lat: number;
  lon: number;
  openNow: boolean | string;
  placeId: string;

  constructor(cafe: any) {
    this.name = cafe.name;
    this.address = cafe.vicinity;
    this.lat = cafe.geometry.location.lat;
    this.lon = cafe.geometry.location.lng;
    this.openNow = cafe.opening_hours?.open_now ?? DEFAULT_OPENING_HOURS;
    this.placeId = cafe.place_id;
  }
}

export class CafeStoreHoursDTO {
  day: string;
  startTime: string | null;
  endTime: string | null;
  is24Hours: boolean | false;

  constructor(day_text: string) {
    const [day, time] = day_text.split(': ');
    this.day = day;
    if (time === PLACE_24_HOURS) {
      this.is24Hours = true;
      return;
    } 
    
    [this.startTime, this.endTime] = time.split('–');
  }
}
import { IsNumber } from 'class-validator';

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
  name: string;
  address: string;
  lat: number;
  lon: number;
  openNow: boolean | string;
  openingHours: string[] | '정보 없음';
}
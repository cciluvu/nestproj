import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsLongitude()
  @IsNumber()
  lng: number;

  @IsLatitude()
  @IsNumber()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Min(0)
  @Max(10000000)
  @IsNumber()
  price: number;
}

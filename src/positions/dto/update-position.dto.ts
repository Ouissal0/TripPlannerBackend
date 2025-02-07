import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class UpdatePositionDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  tripId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

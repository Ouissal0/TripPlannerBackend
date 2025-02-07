import { IsString, IsArray, IsNumber, IsBoolean, IsDate, IsOptional, ValidateNested, IsEmail } from 'class-validator';
import { Type } from "class-transformer";

class ActivityDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  time: Date;

  @IsString()
  @IsOptional()
  description: string;
}

class EmergencyContactDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  relationship: string;
}

export class CreateTripDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  mainDestination: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  intermediateStops?: string[];

  @IsString()
  @IsOptional()
  transportMode: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests: string[];

  @IsNumber()
  @IsOptional()
  budget: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  @IsOptional()
  activities?: ActivityDto[];

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  companions?: string[];

  @IsString()
  @IsOptional()
  accommodationType: string;

  @IsNumber()
  @IsOptional()
  accommodationBudget: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mealPreferences: string[];

  @IsBoolean()
  @IsOptional()
  insuranceRequired: boolean;

  @IsBoolean()
  @IsOptional()
  visaRequired: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsNumber()
  @IsOptional()
  numberOfTravelers: number;
  @IsArray()
  @IsOptional()
  images?: string[];
  @IsString()
  @IsOptional()
  specialRequirements?: string;

  @ValidateNested()
  @Type(() => EmergencyContactDto)
  @IsOptional()
  emergencyContact?: EmergencyContactDto;
}

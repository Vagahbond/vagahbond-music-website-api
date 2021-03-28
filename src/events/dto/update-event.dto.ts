import { BookingMethod } from '../booking-method-enum';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(BookingMethod)
  @ApiPropertyOptional()
  bookingMethod?: BookingMethod;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  bookingUrl?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @ApiPropertyOptional()
  eventDate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  location?: string;
}
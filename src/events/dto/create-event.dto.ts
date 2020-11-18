import { IsDate, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingMethod } from '../events.entity'

export class CreateEventDTO {
  @IsString()
  @Length(1, 64)
  @ApiProperty()
  name: string;

  @IsEnum(BookingMethod)
  @ApiProperty()
  bookingMethod: BookingMethod;

  @IsOptional()
  @IsString()
  @Length(10, 128)
  @ApiPropertyOptional()
  bookingUrl?: string;

  @IsDate()
  @ApiProperty()
  eventDate: Date;

  @IsString()
  @Length(10, 32)
  @ApiProperty()
  location: string;
}

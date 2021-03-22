import { BookingMethod } from '../booking-method-enum'
import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateEventDTO {
  @IsString()
  @Length(1, 64)
  @ApiProperty()
  name: string;

  @IsEnum(BookingMethod, { message: `bookingMethod must be one of these: ${Object.values(BookingMethod).map(str => str.toString())}` })
  @ApiProperty({ examples: Object.values(BookingMethod).map(str => str.toString()) })
  bookingMethod: BookingMethod;

  @IsOptional()
  @IsString()
  @Length(10, 128)
  @ApiPropertyOptional()
  bookingUrl?: string;

  @IsDateString({ message: 'eventDate must be Date formatted following ISO8601!'})
  @ApiProperty()
  eventDate: Date;

  @IsString()
  @Length(10, 32)
  @ApiProperty()
  location: string;
}

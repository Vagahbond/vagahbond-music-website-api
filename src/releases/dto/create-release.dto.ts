import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateReleaseDTO {
  @IsString()
  @Length(1, 64)
  @ApiProperty()
  readonly name: string;

  @IsString()
  @Length(1, 512)
  @IsOptional()
  @ApiPropertyOptional()
  readonly description?: string;

  @IsDateString({
    message: 'releaseDate must be Date formatted following ISO8601!',
  })
  @ApiProperty()
  readonly releaseDate: Date;
}

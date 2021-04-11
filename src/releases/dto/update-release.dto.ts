import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateReleaseDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  readonly description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString({
    message: 'releaseDate must be Date formatted following ISO8601!',
  })
  @ApiPropertyOptional()
  releaseDate?: Date;
}

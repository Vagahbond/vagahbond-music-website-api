import {  ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindByTrackDTO {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  readonly description?: string;
}

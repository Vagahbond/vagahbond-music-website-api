import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name?: string;
}

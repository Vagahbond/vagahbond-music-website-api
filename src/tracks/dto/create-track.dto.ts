import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateTrackDTO {
  @IsString()
  @Length(1, 64)
  @ApiProperty()
  readonly name: string;

  @IsString()
  @Length(1, 512)
  @IsOptional()
  @ApiPropertyOptional()
  readonly description?: string;

  @IsNotEmpty()
  @IsUUID('all')
  @ApiProperty({ description: 'release ID' })
  readonly release: string;

}

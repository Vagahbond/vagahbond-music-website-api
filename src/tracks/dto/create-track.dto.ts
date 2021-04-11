import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateTrackDTO {
  @IsString()
  @Length(1, 64)
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsUUID('all')
  @ApiProperty({ description: 'release ID' })
  readonly release: string;
}

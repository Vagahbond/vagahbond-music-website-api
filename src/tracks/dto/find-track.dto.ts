import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Exists } from 'src/common/validators/exists-validation';
import { Track } from '../track.entity';

export class FindTrackDTO {
  @IsUUID('all')
  @Exists(Track)
  @ApiProperty()
  id: string;
}

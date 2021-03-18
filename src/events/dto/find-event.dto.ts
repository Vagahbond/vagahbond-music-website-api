import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '../../common/validators/exists-validation';

export class FindEventDTO {
  @IsUUID('all')
  @Exists(Event)
  @ApiProperty()
  id: string
}

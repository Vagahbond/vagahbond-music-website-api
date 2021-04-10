import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Length } from 'class-validator';

export class CreateReleaseDTO {
  @IsString()
  @Length(1, 64)
  @ApiProperty()
  readonly name: string;

  @IsDateString({
    message: 'releaseDate must be Date formatted following ISO8601!',
  })
  @ApiProperty()
  readonly releaseDate: Date;
}

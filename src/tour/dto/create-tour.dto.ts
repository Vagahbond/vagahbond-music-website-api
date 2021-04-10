import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, Length } from "class-validator";

export class CreateTourDTO {

  @IsString()
  @Length(1, 64)
  @ApiProperty()
  readonly name: string;

  @IsString()
  @Length(1, 512)
  @ApiProperty()
  readonly description: string;

  @IsDateString({
    message: 'releaseDate must be Date formatted following ISO8601!',
  })
  @ApiProperty()
  readonly startDate: Date;

  @IsDateString({
    message: 'releaseDate must be Date formatted following ISO8601!',
  })
  @ApiProperty()
  readonly endDate: Date;
}
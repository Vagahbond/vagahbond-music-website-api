import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString, Length } from "class-validator";

export class CreateReleaseDTO {

  @IsString()
  @Length(1, 64)
  @ApiProperty()
  name: string;

  @IsDate()
  @ApiProperty()
  releaseDate: Date;
}
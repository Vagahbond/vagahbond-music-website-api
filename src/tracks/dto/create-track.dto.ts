import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateTrackDTO {

  @IsString()
  @Length(1, 64)
  @ApiProperty()
  readonly name: string;

}
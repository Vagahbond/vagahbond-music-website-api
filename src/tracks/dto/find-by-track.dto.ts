import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FindByTrackDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
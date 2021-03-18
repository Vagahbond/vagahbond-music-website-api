import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateTrackDTO {

  @IsString()
  @Length(1, 64)
  @ApiProperty()
  name: string;

  @IsString()
  @Length(1, 64)
  @ApiProperty()
  soundCloudLink: string;

  @IsString()
  @Length(1, 64)
  @ApiProperty()
  youTubeLink: string;

  @IsString()
  @Length(1, 64)
  @ApiProperty()
  soundHiveLink: string;

  @IsString()
  @Length(1, 128)
  @ApiProperty()
  audioFileName: string;
}
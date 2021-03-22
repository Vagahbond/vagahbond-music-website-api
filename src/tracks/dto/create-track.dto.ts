import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class CreateTrackDTO {

  @IsString()
  @Length(1, 64)
  @ApiProperty()
  readonly name: string;

  @IsString()
  @Length(1, 64)
  @IsOptional()
  @ApiProperty()
  readonly soundCloudLink?: string;

  @IsString()
  @Length(1, 64)
  @IsOptional()
  @ApiProperty()
  readonly youTubeLink?: string;

  @IsString()
  @Length(1, 64)
  @IsOptional()
  @ApiProperty()
  readonly soundHiveLink?: string;
}
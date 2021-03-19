import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTrackDTO {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  soundCloudLink: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  youTubeLink: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  soundHiveLink: string;

}

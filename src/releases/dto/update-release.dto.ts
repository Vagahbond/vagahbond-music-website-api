import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateReleaseDTO {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @ApiPropertyOptional()
  releaseDate?: Date
}

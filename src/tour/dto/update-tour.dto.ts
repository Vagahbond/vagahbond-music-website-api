import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTourDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  readonly description?: string;

  @IsOptional()
  @IsDateString({
    message: 'releaseDate must be Date formatted following ISO8601!',
  })
  @ApiPropertyOptional()
  readonly startDate?: Date;

  @IsOptional()
  @IsDateString({
    message: 'releaseDate must be Date formatted following ISO8601!',
  })
  @ApiPropertyOptional()
  readonly endDate?: Date;

}

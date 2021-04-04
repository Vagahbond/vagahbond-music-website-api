import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { InsertStreamingLinkDTO } from "src/streaming-link/dto/insert-streaming-link.dto";

export class UpdateTrackDTO {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @ApiPropertyOptional()
  streamingLinks?: InsertStreamingLinkDTO[]
}

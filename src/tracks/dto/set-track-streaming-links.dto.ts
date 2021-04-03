import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";
import { InsertStreamingLinkDTO } from "src/streaming-link/dto/insert-streaming-link.dto";


export class SetTrackStreamingLinksDTO {

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  streamingLinks: InsertStreamingLinkDTO[]
}
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { Exists } from "src/common/validators/exists-validation";
import { StreamingLink } from "../streaming-link.entity";

export class FindStreamingLinkDTO {
  @IsUUID('all')
  @Exists(StreamingLink)
  @ApiProperty()
  id: string
}
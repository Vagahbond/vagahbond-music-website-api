import { ApiProperty } from "@nestjs/swagger";

export default class AffectedResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  url: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { Exists } from "src/common/validators/exists-validation";
import { Release } from "../release.entity";

export class FindReleaseDTO {
  @IsUUID('all')
  @Exists(Release)
  @ApiProperty()
  id: string
}
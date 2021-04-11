import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { Exists } from "src/common/validators/exists-validation";
import { Tour } from "../tour.entity";

export class FindTourDTO {
  @IsUUID('all')
  @Exists(Tour)
  @ApiProperty()
  id: string;
}
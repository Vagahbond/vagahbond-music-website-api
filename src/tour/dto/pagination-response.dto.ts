import { ApiProperty } from "@nestjs/swagger";
import { Pagination } from "src/common/dto/pagination.dto";
import { Tour } from "../tour.entity";

export class TourPagination extends Pagination {
  @ApiProperty({ type: [Tour] })
  items: Tour[]
}

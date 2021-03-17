import { ApiProperty } from "@nestjs/swagger";
import { Pagination } from "src/shared/dto/pagination.dto";
import { Event } from "../events.entity"

export class EventPagination extends Pagination {
  @ApiProperty({ type: [Event] })
  items: Event[];
}


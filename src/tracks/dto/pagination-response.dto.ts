import { ApiProperty } from "@nestjs/swagger";
import { Pagination } from "src/shared/dto/pagination.dto";
import { Track } from "../tracks.entity";

export class TrackPagination extends Pagination {
  @ApiProperty({ type: [Track]})
  items: Track[];
}

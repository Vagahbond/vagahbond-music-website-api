import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from 'src/common/dto/pagination.dto';
import { Track } from '../track.entity';

export class TrackPagination extends Pagination {
  @ApiProperty({ type: [Track] })
  items: Track[];
}

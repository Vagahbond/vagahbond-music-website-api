import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from 'src/common/dto/pagination.dto';
import { Event } from '../events.entity';

export class EventPagination extends Pagination {
  @ApiProperty({ type: [Event] })
  items: Event[];
}

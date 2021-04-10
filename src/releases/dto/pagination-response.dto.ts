import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from 'src/common/dto/pagination.dto';
import { Release } from '../release.entity';

export class ReleasePagination extends Pagination {
  @ApiProperty({ type: [Release] })
  items: Release[];
}

import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { CreateEventDTO } from './create-event.dto';

export class CreateEventsAPIBody extends CreateEventDTO {
  @ApiProperty({
    type: 'file',
    description: `An image file of format ${
      Object.values(ImageFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  picture: BufferedFile;
}
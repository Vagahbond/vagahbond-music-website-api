import { ApiProperty } from '@nestjs/swagger';
import { AudioFileMediaTypes } from 'src/media-types';
import { BufferedFile } from 'src/minio-client/file.model';
import { CreateTrackDTO } from './create-track.dto';

export class CreateTrackAPIBody extends CreateTrackDTO {
  @ApiProperty({
    type: 'file',
    description: `An audio file of format ${
      Object.values(AudioFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  trackFile: BufferedFile;
}

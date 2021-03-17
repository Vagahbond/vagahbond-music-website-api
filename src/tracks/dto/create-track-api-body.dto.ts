import { fileURLToPath } from "url";

import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';


export class CreateTrackAPIBody extends CreateTrackDTO {
  @ApiProperty({
    type: 'file',
    description: `An audio file of format ${
      Object.values(AudioFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`
  })
  audioFile: BufferedFile
}
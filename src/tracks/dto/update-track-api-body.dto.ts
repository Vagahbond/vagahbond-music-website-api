import { ApiPropertyOptional } from "@nestjs/swagger";
import { AudioFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { UpdateTrackDTO } from "./update-track.dto";

export class UpdateTrackAPIBody extends UpdateTrackDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An audio file of format ${
      Object.values(AudioFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  audioFile?: BufferedFile;
}

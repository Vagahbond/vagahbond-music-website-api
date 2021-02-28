import { ApiPropertyOptional } from "@nestjs/swagger";
import { ImageFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { UpdateEventDTO } from "./update-event.dto";

export class UpdateEventAPIBody extends UpdateEventDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An image file of format ${
      Object.values(ImageFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  cover_file?: BufferedFile;
}

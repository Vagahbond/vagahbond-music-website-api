import { ApiPropertyOptional } from "@nestjs/swagger";
import { ImageFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { UpdateTourDTO } from "./update-tour.dto";

export class UpdateTourAPIBody extends UpdateTourDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An image file of format ${
      Object.values(ImageFileMediaTypes).filter(
        (value) => typeof value === 'string'
      ) as string[]
    }`,
  })
  imageFile?: BufferedFile
}

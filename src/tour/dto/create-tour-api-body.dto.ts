import { ApiProperty } from "@nestjs/swagger";
import { ImageFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { CreateTourDTO } from "./create-tour.dto";

export class CreateTourAPIBody extends CreateTourDTO {
  @ApiProperty({
    type: 'file',
    description: `A picture file of format ${
      Object.values(ImageFileMediaTypes).filter(
        value => typeof value === 'string',
      ) as string[]
    }`,
  })
  pictureFile: BufferedFile;
}

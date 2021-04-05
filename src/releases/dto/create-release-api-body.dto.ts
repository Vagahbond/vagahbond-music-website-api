import { ApiProperty } from "@nestjs/swagger";
import { ImageFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { CreateReleaseDTO } from "./create-release.dto";

export class CreateReleaseApiBody extends CreateReleaseDTO {
  @ApiProperty({
    type: 'image file',
    description: `An image file of format ${
      Object.values(ImageFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`
  })
  coverFile: BufferedFile
}
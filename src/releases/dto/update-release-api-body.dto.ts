import { ApiPropertyOptional } from "@nestjs/swagger";
import { ImageFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { UpdateReleaseDTO } from "./update-release.dto";

export class UpdateReleaseAPIBody extends UpdateReleaseDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An image file of format ${
      Object.values(ImageFileMediaTypes).filter(
        value => typeof value === 'string'
      ) as string[]
    }`
  })
  coverFile?: BufferedFile;

}

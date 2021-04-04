import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { StreamingPlatform } from "../streaming-platforms.enum";

export class CreateStreamingLinkDTO {
  
  @IsString()
  @Length(1, 128)
  @ApiProperty() 
  url: string

  @IsEnum(
    StreamingPlatform, 
    { 
      message: `platform must be one of these: ${
        Object.values(StreamingPlatform).map(str => str.toString())
      }.` 
    })
  @ApiProperty({ examples: Object.values(StreamingPlatform).map(str => str.toString()) })
  platform: StreamingPlatform;

  @IsNotEmpty()
  @IsUUID('all')
  @ApiProperty({ description: 'track id' })
  track: string;
}
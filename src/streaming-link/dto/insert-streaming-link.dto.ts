import { StreamingPlatform } from "../streaming-platforms-enum";

export class InsertStreamingLinkDTO {
  url: string;

  platform: StreamingPlatform;
}
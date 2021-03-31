import { Track } from "src/tracks/track.entity";
import { StreamingPlatform } from "../streaming-platforms-enum";

export class InsertStreamingLinkDTO {
  url: string;

  platform: StreamingPlatform;

  track: Track;
}

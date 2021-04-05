import { Release } from "src/releases/release.entity";
import { StreamingLink } from "src/streaming-link/streaming-link.entity";

export class InsertTrackDTO {
  name: string;

  release: Release

  streamingLinks: StreamingLink[]
}

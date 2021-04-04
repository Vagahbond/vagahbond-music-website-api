import { Release } from "src/releases/release.entity";

export class InsertTrackDTO {
  name: string;

  release: Release
}

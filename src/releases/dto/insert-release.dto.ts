import { Track } from 'src/tracks/track.entity';

export class InsertReleaseDTO {
  name: string;

  releaseDate: Date;

  tracks: Track[];
}

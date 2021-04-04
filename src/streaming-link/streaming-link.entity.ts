import { ApiProperty } from "@nestjs/swagger";
import { Track } from "src/tracks/track.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StreamingPlatform } from "./streaming-platforms.enum";

@Entity('streaming_links')
export class StreamingLink extends BaseEntity {
  constructor(partial: Partial<StreamingLink>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '128' })
  url: string;

  @ApiProperty()
  @Column({
    name: 'streaming-platform',
    type: 'enum',
    enum: StreamingPlatform
  })
  platform: StreamingPlatform

  @ApiProperty({ type: () => Track })
  @ManyToOne(() => Track, track => track.streamingLinks, { nullable: false })
  // @JoinColumn(
  //   { name: 'trackId', referencedColumnName: 'id'},
  // )
  track: Track;
}

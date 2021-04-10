import { ApiProperty } from '@nestjs/swagger';
import { Release } from 'src/releases/release.entity';
import { StreamingLink } from 'src/streaming-link/streaming-link.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('tracks')
export class Track extends BaseEntity {
  constructor(partial: Partial<Track>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '64' })
  name: string;

  @ApiProperty({ type: () => StreamingLink })
  @OneToMany(() => StreamingLink, (streamingLink) => streamingLink.track, {
    eager: true,
  })
  @JoinColumn()
  streamingLinks: StreamingLink[];

  @ApiProperty({ type: () => Release })
  @ManyToOne(
    () => Release, 
    (release) => release.tracks, 
    { nullable: false })
  release: Release;

  @ApiProperty()
  @Column({ type: 'varchar', length: '128' })
  audioFileName: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

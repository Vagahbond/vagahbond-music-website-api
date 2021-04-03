import { ApiProperty } from '@nestjs/swagger';
import { StreamingLink } from 'src/streaming-link/streaming-link.entity';
import { 
  BaseEntity, 
  Column, 
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany
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

  @ApiProperty()
  @OneToMany(() => StreamingLink, streamingLink => streamingLink.track)
  streamingLinks: StreamingLink[];

  @ApiProperty()
  @Column({ type: "varchar", length: '128'})
  audioFileName: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

}
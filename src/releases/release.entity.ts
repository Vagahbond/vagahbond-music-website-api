import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Track } from 'src/tracks/track.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('releases')
export class Release extends BaseEntity {
  constructor(partial: Partial<Release>) {
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
  @Column({ type: 'varchar', length: '128' })
  coverFileName: string;

  @ApiProperty({ type: () => Track })
  @OneToMany(() => Track, (track) => track.release, {
    eager: true,
    nullable: false,
  })
  tracks: Track[];

  @ApiProperty()
  @Column({ type: 'date' })
  releaseDate: Date;

  @ApiPropertyOptional()
  @Column({type: 'varchar', length: '512', nullable: true})
  description?: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

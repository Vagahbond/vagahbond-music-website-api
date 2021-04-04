import { ApiProperty } from "@nestjs/swagger";
import { Track } from "src/tracks/track.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('releases')
export class Release extends BaseEntity {
  constructor(partial: Partial<Release>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @Column({ type: 'varchar', length: '64'})
  name:string

  @ApiProperty()
  @Column({ type: 'varchar', length: '128'})
  coverFileName: string;

  @ApiProperty()
  @ManyToOne(
    () => Track,
    track => track.release,
    { eager: true }
  )
  tracks: Track[];

  @ApiProperty()
  @Column({ type: 'date'})
  releaseDate: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { 
  BaseEntity, 
  Column, 
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn, 
  UpdateDateColumn
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
  @Column({ type: 'varchar', length: '64', nullable: true })
  soundCloudLink: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '64', nullable: true })
  youTubeLink: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '64', nullable: true })
  soundHiveLink: string;

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
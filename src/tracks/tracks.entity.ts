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
  @Column({ type: 'varchar2', length: '64' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar2', length: '64' })
  soundCloudLink: string;

  @ApiProperty()
  @Column({ type: 'varchar2', length: '64' })
  youTubeLink: string;

  @ApiProperty()
  @Column({ type: 'varchar2', length: '64' })
  soundHiveLink: string;

  @ApiProperty()
  @Column({ type: "varchar2", length: '128'})
  audioFileName: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

}
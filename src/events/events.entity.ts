import { ApiProperty } from '@nestjs/swagger';
import { 
  BaseEntity, 
  Column, 
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn, 
  UpdateDateColumn
} from 'typeorm';

@Entity('events')
export class Event extends BaseEntity {
  constructor(partial: Partial<Event>) {
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
  bookingMethod: string;

  @ApiProperty()
  @Column({ type: 'varchar2', length: '128' })
  bookingUrl: string;

  @ApiProperty()
  @Column({ type: 'datetime2' })
  eventDate: Date;

  @ApiProperty()
  @Column({ type: "varchar2", length: '128'})
  coverFilename: string;

  @ApiProperty()
  @Column({ type: 'varchar2', length: '32'})
  location: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

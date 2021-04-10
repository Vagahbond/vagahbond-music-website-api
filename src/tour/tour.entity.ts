import { ApiProperty } from '@nestjs/swagger';
import { Event } from 'src/events/events.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tours')
export class Tour extends BaseEntity {
  constructor(partial: Partial<Tour>) {
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
  @Column({ type: 'varchar', length: '512' })
  description: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '128' })
  pictureFilename: string;

  @ApiProperty({ type: () => Event })
  @OneToMany(() => Event, event => event.tour, {
    eager: true,
    nullable: false,
  })
  events: Event[];

  @ApiProperty()
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty()
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

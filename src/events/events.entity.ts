import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptional } from 'class-validator';
import { BookingMethod } from './booking-method-enum';

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
  @Column({ length: '64' })
  name: string;

  @ApiProperty()
  @Column({
    name: 'booking-method',
    type: 'enum',
    enum: BookingMethod,
    default: BookingMethod.FREE,
  })
  bookingMethod: BookingMethod;

  @ApiProperty()
  @Column({ length: '256', nullable: true })
  @IsOptional()
  bookingUrl?: string;

  @ApiProperty()
  @Column()
  eventDate: Date;

  @ApiProperty()
  @Column({ length: '256' })
  pictureFilename: string;

  @ApiProperty()
  @Column({ length: '32' })
  location: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

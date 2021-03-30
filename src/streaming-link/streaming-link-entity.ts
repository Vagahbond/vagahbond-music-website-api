import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StreamingPlatform } from "./streaming-platforms-enum";

@Entity('streaming-links')
export class StreamingLink extends BaseEntity {
  constructor(partial: Partial<StreamingLink>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({type: 'varchar', length: '128'})
  url: string;

  @ApiProperty()
  @Column({
    name: 'streaming-platform',
    type: 'enum',
    enum: StreamingPlatform
  })
  platform: StreamingPlatform
}
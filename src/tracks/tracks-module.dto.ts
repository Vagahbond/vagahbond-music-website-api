import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventsService } from "src/events/events.service";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import { TracksController } from "./tracks.controller";
import { Track } from "./tracks.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    MinioClientModule
  ],
  controllers: [TracksController],
  providers: [EventsService],
})
export class TracksModule{}

import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import { TracksController } from "./tracks.controller";
import { Track } from "./track.entity";
import { TracksService } from "./tracks.service";
import { StreamingLinksModule } from "src/streaming-link/streaming-link.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    forwardRef(() => StreamingLinksModule),
    MinioClientModule
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule{}

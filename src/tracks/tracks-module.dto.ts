import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import { TracksController } from "./tracks.controller";
import { Track } from "./track.entity";
import { TracksService } from "./tracks.service";
import { ReleaseModule } from "src/releases/releases.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    forwardRef(() => ReleaseModule),
    MinioClientModule
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService]
})
export class TracksModule{}

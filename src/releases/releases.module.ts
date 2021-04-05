import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import { Release } from "./release.entity";
import { ReleaseController } from "./releases.controller";
import { ReleasesService } from "./releases.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([Release]),
    MinioClientModule
  ],
  controllers: [ReleaseController],
  providers: [ReleasesService],
  exports: [ReleasesService]
})
export class ReleaseModule{}
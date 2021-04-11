import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import { Tour } from "./tour.entity";
import { ToursController } from "./tours.controller";
import { ToursService } from "./tours.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour]),
    MinioClientModule
  ],
  providers: [ToursService],
  exports: [ToursService],
  controllers: [ToursController],
})
export class ToursModule {}

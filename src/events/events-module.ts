import {  Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    MinioClientModule
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})

export class EventsModule {}

import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MinioClientModule } from "src/minio-client/minio-client.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    MinioClientModule
  ]
})
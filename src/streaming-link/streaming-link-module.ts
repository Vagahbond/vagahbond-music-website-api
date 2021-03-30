import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StreamingLinkService } from "./streaming-link-service";
import { StreamingLink } from './streaming-link-entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([StreamingLink]),
  ],
  providers: [StreamingLinkService],
  exports: [StreamingLinkService],
})
export class StreamingLinksModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from 'src/tracks/tracks.module';
import { StreamingLinkService } from './streaming-links.service';
import { StreamingLink } from './streaming-link.entity';
import { StreamingLinkController } from './streaming-links.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StreamingLink]),
    forwardRef(() => TracksModule),
  ],
  providers: [StreamingLinkService],
  exports: [StreamingLinkService],
  controllers: [StreamingLinkController],
})
export class StreamingLinksModule {}

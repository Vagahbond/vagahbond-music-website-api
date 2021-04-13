/* eslint-disable class-methods-use-this */
import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import * as ormconfig from './ormconfig';
import { TracksModule } from './tracks/tracks.module';
import { AuthModule } from './auth/auth.module';
import { StreamingLinksModule } from './streaming-link/streaming-links.module';
import { ReleaseModule } from './releases/releases.module';
import { ToursModule } from './tour/tours.module.';

export function DatabaseOrmModule(): DynamicModule {
  // we could load the configuration from dotEnv here,
  // but typeORM cli would not be able to find the configuration file.

  return TypeOrmModule.forRoot(ormconfig);
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventsModule,
    TracksModule,
    StreamingLinksModule,
    ReleaseModule,
    ToursModule,
    TypeOrmModule.forRoot(ormconfig),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        prettyPrint: process.env.NODE_ENV !== 'production',
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


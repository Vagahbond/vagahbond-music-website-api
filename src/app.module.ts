import { Module, DynamicModule} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events-module';
import * as ormconfig from './ormconfig';
import { LoggerModule } from 'nestjs-pino';
import { TracksModule } from './tracks/tracks-module.dto';
import { ConfigModule } from '@nestjs/config';

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
    TypeOrmModule.forRoot(ormconfig),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        prettyPrint: process.env.NODE_ENV !== 'production',
      },
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to vagahbond\'s website API ! ';
  }
}

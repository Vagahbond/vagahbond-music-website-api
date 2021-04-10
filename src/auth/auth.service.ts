/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { ApiConstants } from './api-constants';
@Injectable()
export class AuthService {
  validateApiKey(key: string): any {
    if (ApiConstants.API_KEY === key) {
      return true;
    }
    return false;
  }
}

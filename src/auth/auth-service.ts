import { Injectable } from '@nestjs/common';
import { authConstants } from './constants'

@Injectable()
export class AuthService {

  validateToken(
    token: string,
  ): boolean {
    return  token === authConstants.authToken;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private authService: AuthService) {
    super(
      {
        header: 'api_key',
        prefix: '',
      },
      true,
      (apiKey: string, done: any, req: Request, next: () => void) => {
        if (!this.authService.validateApiKey(apiKey)) {
          return done(
            new UnauthorizedException(
              'You are not allowed to perform this action.',
            ),
            false,
          );
        }
        return done(null, true, next);
      },
    );
  }
}

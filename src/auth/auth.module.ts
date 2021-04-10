import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './api-key.strategy.';

@Module({
  imports: [PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}

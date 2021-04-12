import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UnauthorizedResponse } from 'src/auth/unauthorized-response';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Default API message' })
  @ApiOkResponse({
    description: 'Default API message',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Test your authentication' })
  @ApiOkResponse({
    description: 'You\'re authentified',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @UseGuards(AuthGuard('headerapikey'))
  @Get()
  getAuth(): string {
    return this.appService.getHello();
  }
}

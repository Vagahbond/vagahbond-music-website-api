import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Default API message"})
  @ApiOkResponse({
    description: "Default API message"
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

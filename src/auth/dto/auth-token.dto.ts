import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDTO {
  @ApiProperty()
  token: string;
}

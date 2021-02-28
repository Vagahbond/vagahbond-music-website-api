import { ApiProperty } from '@nestjs/swagger';

export class AuthAdminDTO {
  @ApiProperty()
  token: string;
}

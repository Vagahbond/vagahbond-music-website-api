/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable class-methods-use-this */
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform {
  transform(value: any): Promise<any> {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException('Body must not be empty!');
    }

    return value;
  }
}

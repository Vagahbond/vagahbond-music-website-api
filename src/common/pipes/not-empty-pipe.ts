import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform {
  async transform(value: any): Promise<any> {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException('Body must not be empty!');
    }

    return value;
  }
}

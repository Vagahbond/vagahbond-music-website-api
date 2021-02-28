import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class TokenAuthGuard  {

  // Get username from JWT payload and inject full user from repository
  // req.user of type User will be accessible anywhere the guard is called
  handleRequest(err: any, isTokenOk: boolean): any {
    if (err || !isTokenOk) {
      throw err || new UnauthorizedException();
    }
    return isTokenOk;
  }
}

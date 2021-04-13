/* eslint-disable class-methods-use-this */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const allowedOrigins = ['http://localhost:3000/', 'https://vagahbond.com/', 'http://front:3000/'];

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (allowedOrigins.indexOf(req.header('Origin') || req.header('Referer') || "") > -1) {
      res.header('Access-Control-Allow-Origin', req.header('Origin')|| req.header('Referer'));
      res.header('Access-Control-Allow-Headers', 'content-type');
      res.header('Access-Control-Allow-Methods', '*');
    }
    next();
  }
}

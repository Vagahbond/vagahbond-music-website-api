import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(){
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    credentials: true,
    exposedHeaders: ['Set-Cookie', 'set-cookie', 'Cookie', 'cookie'],
    origin: [process.env.CLIENT_EXTERNAL_HOST || "http://localhost:3000", "http://front:3000", ],
  });

  app.set('trust proxy', 1);

  
  

  const options = new DocumentBuilder()
    .setTitle("Vagahbond's website's API")
    .setDescription('An API to back my musical portfolio')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[] = []) => {
        return new BadRequestException(errors);
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT || 3000);
}
void bootstrap();

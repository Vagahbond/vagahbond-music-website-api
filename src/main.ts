import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    exposedHeaders: ['Set-Cookie', 'set-cookie', 'Cookie', 'cookie'],
    origin: [process.env.CLIENT_EXTERNAL_HOST || "http://localhost:3000"],
  });

  
  

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

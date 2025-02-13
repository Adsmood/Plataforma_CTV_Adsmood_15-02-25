import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración global
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  
  // Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('Adsmood CTV API')
    .setDescription('API para generación de VAST y tracking')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  await app.listen(port);
}
bootstrap();

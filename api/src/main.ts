import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS
  app.enableCors({
    origin: [
      'https://ctv-render-13-02.onrender.com',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('AdsMood CTV API')
    .setDescription('API para la generación dinámica de VAST y tracking de anuncios CTV')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Puerto dinámico para Render.com
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap(); 
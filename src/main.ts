import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    skipNullProperties: true
  }));

  app.useGlobalFilters(new AllExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API de Agustín')
    .setDescription('Documentación del CRUD de Tareas y Usuarios')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//! git commit -a -m "fix:Estructura funcional del CRUD de Tareas y uso de validaciones"
//! git commit -a -m "fix:Conexion a base de datos  tradicional"
//! git commit -a -m "fix: Uso de prisma y correcion de CRUD (Tareas y Usuarios)"


//? BCRYPT
//! npm i bcrypt
//! npm i @types/bcrypt
//!npm install --save @nestjs/jwt
//! git commit -a -m "fix: Correcion del Crud de Usuarios, creacion de rutas para la autenticacion" 09/03/2026
//!siguiente clase tiene que ver con la autentificacion
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaService } from './prisma.service';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  }); //?pa permitir que angular se conecte
  app.use(helmet({
    crossOriginResourcePolicy: false,
  })); //?Instalé el helmet para proteger la api DE INYECCIONES XSS EXTRAÑAS

  app.use(hpp()); //?instalé el hpp para proteger la api DE INYECCIONES XSS EXTRACÑAS

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, //?este es para que el profe no meta json al body
    skipNullProperties: true
  }));

  const prismaService = app.get(PrismaService);
  app.useGlobalFilters(new AllExceptionFilter(prismaService));

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
//! git commit -a -m "fix: Correccion de refrsh y  logout"

//? BCRYPT
//! npm i bcrypt
//! npm i @types/bcrypt
//!npm install --save @nestjs/jwt
//! git commit -a -m "fix: Correcion del Crud de Usuarios, creacion de rutas para la autenticacion" 09/03/2026
//!siguiente clase tiene que ver con la autentificacion
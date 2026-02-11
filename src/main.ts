import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//! git commit -a -m "fix:Estructura funcional del CRUD de Tareas y uso de validaciones"
//! git commit -a -m "fix:Conexion a base de datos  tradicional"
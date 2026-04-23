import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { AuditModule } from './modules/audit/audit.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ //se instaló el throttler para proteger la api
      ttl: 60000,     //pues acá estamos haciendo que el usuario tenga 10 intentos cada 60 segundos
      limit: 10,
    }]), AuthModule, TaskModule, UserModule, AuditModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    } //aplicacmos la proteccion a nivel global
  ],
})
export class AppModule { }
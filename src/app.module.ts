import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { AuditModule } from './modules/audit/audit.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UserModule, AuthModule, TaskModule, AuditModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
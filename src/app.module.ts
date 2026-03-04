import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [AuthModule, TaskModule],
  exports:['DATABASE_CONNECTION'],
  controllers: [],
  providers: [],
})
export class AppModule {}

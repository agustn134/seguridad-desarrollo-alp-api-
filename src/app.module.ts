import { Module } from '@nestjs/common';
import { AuthModule } from './common/modules/auth/auth.module';
import { TaskModule } from './common/modules/task/task.module';

@Module({
  imports: [AuthModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

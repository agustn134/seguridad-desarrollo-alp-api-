import { Module } from "@nestjs/common";
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { databaseProviders } from '../../common/providers/database.provider';
import { PrismaService } from "src/prisma.service";

@Module({
    imports: [],
    controllers: [TaskController],
    providers: [TaskService, databaseProviders[0], PrismaService],
})
export class TaskModule { }

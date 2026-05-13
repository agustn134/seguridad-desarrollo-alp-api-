import { Module } from "@nestjs/common";
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { databaseProviders, UtilService } from 'src/common';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [],
    controllers: [TaskController],
    providers: [TaskService, databaseProviders[0], PrismaService, UtilService],
})
export class TaskModule { }

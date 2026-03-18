import { Module } from "@nestjs/common";
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { databaseProviders } from '../../common/providers/database.provider';
import { PrismaService } from "src/prisma.service";
import { UtilService } from "src/common/services/utili.service";

@Module({
    imports: [],
    controllers: [TaskController],
    providers: [TaskService, databaseProviders[0], PrismaService, UtilService],
})
export class TaskModule { }

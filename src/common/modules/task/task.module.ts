// import { Module } from "@nestjs/common";
// import { TaskController } from "./task.controller";
// import { TaskService } from "./task.service";
// import { databaseProvider } from "src/common/providers/database.provider";

// @Module({
//     controllers:[TaskController],
//     providers:[TaskService, databaseProvider[0]]
// })

// export class TaskModule{ }

import { Module } from "@nestjs/common";
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { databaseProviders } from '../../../common/providers/database.provider';

@Module({
    controllers: [TaskController],
    providers: [
        TaskService, databaseProviders[0] 
    ],
})
export class TaskModule {}

import { Controller, Get } from "@nestjs/common";
import { TaskService } from "./task.service";


@Controller("api/task")
export class TaskController{
    constructor(private readonly tskSvc: TaskService){}

    @Get()
    public task(): string{
        return this.tskSvc.List();
    }
}
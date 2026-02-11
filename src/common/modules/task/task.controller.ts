// import { Controller, Get, HttpException, ParseIntPipe } from "@nestjs/common";
// import { TaskService } from "./task.service";


// @Controller("api/task")
// export class TaskController{
//     constructor(private readonly taskSvc: TaskService){}

//     @Get()
//     public task(): string{
//         return this.taskSvc.List();
//     }

//     //!tengo un desmadre 

//     public getTaskBy(): Promise<any[]> {
//         return await this.taskSvc.getTasks();
//     }

//     @Get(":id")
//     //! GET https:localhost:3000/api/task/1
//     public getTaskById(@Param("id") ParseIntPipe) id:number): {
//         var task = await this.taskSvc.getTaskById(id);

//         if(task && task.lenght > 0) return task;
//         else throw new HttpException('Task not found', HttpStatus.NOt_)
//     }

//     @Post()
//     public insertTask(task: any):any{
//         return this.taskSvc.insertTask(task)
//     }

//     @Put(":id")
//     public updateTask(id:number, task:any):any{
//         return this.taskSvc.updateTask(id, task);
//     }

//     //? Delete https:localhost
//     @Delete(":id")
//     public deleteTask(id: number) {
//         return this.taskSvc.deleteTask(id);
//     }
// }

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from './dto/create-task.dto';
@Controller("api/task")
export class TaskController {
    constructor(private readonly taskSvc: TaskService) { }

    //? http://localhost:3000/api/task
    @Get()
    public async getTasks(): Promise<any[]> {
        return await this.taskSvc.getTasks();
    }

    // %27%20OR%20%271%27=%271
    // ' OR '1' = '1
    // UNION SELECT * FROM users 
    //! GET http://localhost:3000/api/task/1
    // ParseIntPipe -> Valida que el parametro sea solo un numero entero.
    @Get(":id")
    public async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        var task = await this.taskSvc.getTaskById(id);

        if (task && task.length > 0) return task;
        else throw new HttpException("Task not found", HttpStatus.NOT_FOUND)

    }

    //* POST http://localhost:3000/api/task/
    @Post()
    public async insertTask(@Body() task: CreateTaskDto): Promise<any> {
        return await this.taskSvc.insertTask(task)
    }

    //! PUT http://localhost:3000/api/task/:id
    @Put(":id")
    public updateTask(@Param('id', ParseIntPipe) id: number, @Body() task: any): any {
        return this.taskSvc.updateTask(id, task);
    }

    //? DELETE http://localhost:3000/api/task/:id
    @Delete(":id")
    public deleteTask(@Param('id', ParseIntPipe) id: number) {
        return this.taskSvc.deleteTask(id)
    }
}
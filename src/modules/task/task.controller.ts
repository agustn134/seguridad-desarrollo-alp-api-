import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from "./dto/update.task.dto";
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller("api/task")
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  //? http://localhost:3000/api/task
  @Get()
  // public async getTasks(): Promise<any[]> {
  //     return await this.taskSvc.getTasks();
  // }
  @ApiOperation({ summary: 'Obtiene todas las tareas' })
  public async getTask(): Promise<any[]> {
    return await this.taskSvc.getTasks();
  }

  // %27%20OR%20%271%27=%271
  // ' OR '1' = '1
  // UNION SELECT * FROM users 
  //! GET http://localhost:3000/api/task/1
  // ParseIntPipe -> Valida que el parametro sea solo un numero entero.
  // @Get(":id")
  // public async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<any> {
  //     var task = await this.taskSvc.getTaskById(id);

  //     if (task && task.length > 0) return task;
  //     else throw new HttpException("Task not found", HttpStatus.NOT_FOUND)

  // }
  @Get(':id')
  public async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const task = await this.taskSvc.getTaskById(id);
    if (task) return task;
    throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
  }

  //* POST http://localhost:3000/api/task/
  @Post()
  public async insertTask(@Body() task: CreateTaskDto): Promise<any> {
    return await this.taskSvc.insertTask(task)
  }

  //! PUT http://localhost:3000/api/task/:id
  // @Put(":id")
  // public updateTask(@Param('id', ParseIntPipe) id: number, @Body() task: any): any {
  //     return this.taskSvc.updateTask(id, task);
  // }
  @Put(':id')
  public async updateTask(@Param('id', ParseIntPipe) id: number, @Body() task: UpdateTaskDto): Promise<any> {
    return this.taskSvc.updateTask(id, task);
  }

  //? DELETE http://localhost:3000/api/task/:id
  // @Delete(":id")
  // // public deleteTask(@Param('id', ParseIntPipe) id: number) {
  // //     return this.taskSvc.deleteTask(id)
  // // }
  // public deleteTask(@Param('id', ParseIntPipe) id: number: Promise<boolean>{
  //     try{
  //         await this.taskSvc.deleteTask(id);
  //     } catch(error){
  //         throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
  //     }
  //     return true;
  // }
  //? DELETE http://localhost:3000/api/task/:id
  // @Delete(":id")
  // public async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
  //     try {
  //         await this.taskSvc.deleteTask(id);
  //     } catch(error) {
  //         throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  //     }
  //     return true;
  // }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    try {
      await this.taskSvc.deleteTask(id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    return true;
  }

}
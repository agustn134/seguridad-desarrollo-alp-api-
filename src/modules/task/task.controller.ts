import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from "./dto/update.task.dto";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from "../../common/guards/auth.guard";

@ApiTags("Tareas")
@UseGuards(AuthGuard)

@Controller("api/task")
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  //? http://localhost:3000/api/task
  @Get("/get-tasks")
  @ApiOperation({ summary: 'Obtiene todas las tareas' })
  // public async getTasks(): Promise<any[]> {
  //     return await this.taskSvc.getTasks();
  // }
  public async getTasks(@Req() request: any) {
    const userId = request.user.id; // Extraemos el ID del JWT
    return await this.taskSvc.getTasks(userId);
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
  public async getTaskById(@Param("id", ParseIntPipe) id: number, @Req() request: any) {
    const userId = request.user.id;
    const task = await this.taskSvc.getTaskById(id, userId);
    if (task) return task;
    throw new HttpException('Tarea no encontrada o Acceso Denegado', 404);
    return task;
  }

  //* POST http://localhost:3000/api/task/
  @Post()
  public async insertTask(@Body() task: CreateTaskDto, @Req() request: any) {
    const userId = request.user.id; ///sobrescribimos el user_Id del DTO con el del token por seguridad
    return await this.taskSvc.insertTask({ ...task, user_id: userId });
  }

  //! PUT http://localhost:3000/api/task/:id
  // @Put(":id")
  // public updateTask(@Param('id', ParseIntPipe) id: number, @Body() task: any): any {
  //     return this.taskSvc.updateTask(id, task);
  // }
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  public async updateTask(
      @Param('id') id: string, 
      @Body() task: UpdateTaskDto,
      @Req() request: any 
  ): Promise<any> {
      const user = request['user']; 
      return await this.taskSvc.updateTask(Number(id), task, user.id); 
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
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @HttpCode(HttpStatus.OK)
  public async deleteTask(
      @Param('id') id: string,
      @Req() request: any 
  ): Promise<any> {
      const user = request['user']; 
      return await this.taskSvc.deleteTask(Number(id), user.id); 
  }

}
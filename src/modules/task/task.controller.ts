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

  @Get("/get-tasks")
  @ApiOperation({ summary: 'Obtiene todas las tareas' })
  public async getTasks(@Req() request: any) {
    const userId = request.user.id; //extraemos el ID del JWT
    return await this.taskSvc.getTasks(userId);
  }


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

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
    @Req() request: any
  ): Promise<any> {
    const user = request['user'];
    return await this.taskSvc.updateTask(id, task, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @HttpCode(HttpStatus.OK)
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: any
  ): Promise<any> {
    const user = request['user'];
    return await this.taskSvc.deleteTask(id, user.id);
  }

}
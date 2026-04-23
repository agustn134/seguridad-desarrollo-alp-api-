import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Client } from 'pg';
import { Task } from '@prisma/client';
import { UpdateTaskDto } from './dto/update.task.dto';
import { PrismaService } from 'src/prisma.service';
import { HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
  ) { }

  //private tasks: any[] = [];

  // Listar solo tareas del usuario
  public async getTasks(userId: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { user_id: userId },
    });
  }

  //Buscar por ID de tarea Y ID de usuario
  public async getTaskById(id: number, userId: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id: id, user_id: userId },
    });
    return task;
  }

  //Insertar usando el ID del JWT
  public async insertTask(task: CreateTaskDto): Promise<any> {
    await this.prisma.log.create({
      data: {
        action: 'CREACION_TAREA',
        severity: 'INFO',
        statuscode: 201,
        path: '/api/task',
        user_id: task.user_id,
        error: `El usuario creó la tarea: ${task.name}`
      }
    });

    return await this.prisma.task.create({
      data: task,
    });
  }

  //actualizar solo si le pertenece
  public async updateTask(id: number, userId: number, taskUpdated: UpdateTaskDto): Promise<any> {
    const task = await this.prisma.task.findFirst({ where: { id, user_id: userId } });
    if (!task) throw new HttpException("No tienes permiso o la tarea no existe", 403);
    return await this.prisma.task.update({
      where: { id },
      data: taskUpdated,
    });
  }

  public async deleteTask(id: number, userId: number): Promise<Task> {
    //intentar borrar con doble condición de seguridad
    try {
      const task = await this.getTaskById(id, userId);
      if (!task) throw new Error();

      return await this.prisma.task.delete({
        where: { id: id }
      });
    } catch (error) {
      throw new HttpException("No se pudo eliminar la tarea", HttpStatus.FORBIDDEN);
    }
  }
}
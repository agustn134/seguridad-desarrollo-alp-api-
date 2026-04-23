import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Client } from 'pg';
import { Task } from '@prisma/client';
import { UpdateTaskDto } from './dto/update.task.dto';
import { PrismaService } from 'src/prisma.service';
import { HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
  ) { }


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

  public async updateTask(id: number, task: UpdateTaskDto, userId: number): Promise<any> {
    const taskExists = await this.prisma.task.findFirst({
      where: { id: id, user_id: userId }
    });

    if (!taskExists) {
      throw new UnauthorizedException('No tienes permiso para editar esta tarea o no existe');
    }
    return await this.prisma.task.update({
      where: { id: id },
      data: task,
    });
  }

  public async deleteTask(id: number, userId: number): Promise<boolean> {
    const taskExists = await this.prisma.task.findFirst({
      where: { id: id, user_id: userId }
    });

    if (!taskExists) {
      throw new UnauthorizedException('No tienes permiso para eliminar esta tarea o no existe');
    }

    await this.prisma.task.delete({
      where: { id: id }
    });

    await this.prisma.log.create({
      data: { action: 'ELIMINACION_TAREA', severity: 'ADVERTENCIA', statuscode: 200, path: '/api/task', user_id: userId, error: `El usuario eliminó la tarea ID: ${id}` }
    });

    return true;
  }
}
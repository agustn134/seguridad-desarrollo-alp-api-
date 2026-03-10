import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Client } from 'pg';
import { Task } from '@prisma/client';
import { UpdateTaskDto } from './dto/update.task.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Client,
    private prisma: PrismaService,
  ) { }

  private tasks: any[] = [];

  public async getTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks;
  }

  public async getTaskById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id: id },
    });
    return task;
  }

  public async insertTask(task: CreateTaskDto): Promise<any> {
    const newTask = await this.prisma.task.create({
      data: task,
    });
    return newTask;
  }

  public async updateTask(id: number, taskUpdated: UpdateTaskDto): Promise<any> {
    console.log(taskUpdated);
    const task = await this.prisma.task.update({
      where: { id: id },
      data: taskUpdated,
    });
    return task;
  }

  public async deleteTask(id: number): Promise<boolean> {
    const task = await this.prisma.task.delete({
      where: { id: id },
    });
    return !!task;
  }
}
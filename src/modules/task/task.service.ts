// import { Inject, Injectable } from "@nestjs/common";
// import { Client } from "pg";
// import { CreateTaskDto } from "./dto/create-task.dto";

// @Injectable()

// export class TaskService{


//     constructor(
//         @Inject('DATABASE_CONNECTION') private db: Client
//     ){}

//     private tasks: any[] = [];

//     //un elemento asyncrono siempre nos va a prometer devolver una respuesta o un error
//     public async getTasks(): Promise<any[]> {
//         const query = 'SELECT * FROM tasks';
//         const result = await this.db.query(query);

//         return result.rows;
//     }


//     public List(): string{
//         return "Listado de Tareas"
        
//         //!ser mas restringidos, osea que si o si sea de tipo string
//         //!El any consume mas memoria
//     }
//     //     public getTasks(): any {
//     //     return ;
//     // }



//     public getTaskById(id: number):  Promise<any[]> {
//         const query = 'SELECT * FROM tasks WHERE id = '${id}';
//         const result = await this.db.query(query);

//         return result.rows;
//     }

//     public async insertTask(task: CreateTaskDto): Promise<number> {
//         const query = 'INSERT INTO tasks (name, description, priority, userid) Values('${task.name}', '${task.description}', '${task.priority}') RETURNING *';
//         console.log(query);

//         const result = await this.db.query(query)
//         return result.oid;

//     }

//     public updateTask(id:number, task:any):any{
//         const query = '
//         UPDATE task
//         SET name = '${task.name}',
//         description = '${task.description}',
//         priority = ${task.priority}'
//         WHERE id = ${id}
//         RETURNING *
//         ';

//         const result = await this.db.query(query);
//         return result.rows[0];
//     }

//     public deeleteTask(id:number):string{
//         return"Eliminando la tarea";
//     }
// }

// //!iniciar por el servicio, recomendable

// import { Inject, Injectable } from '@nestjs/common';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { Client } from 'pg';
// import { Task } from './entities/task.entity';
// import { UpdateTaskDto } from './dto/update.task.dto';
// import { PrismaService } from 'src/prisma.service';

// @Injectable()
// export class TaskService {

//     constructor(
//         @Inject('DATABASE_CONNECTION') private db: Client,
//         private prisma: PrismaService
//     ) { }
//     // Creacion variable task(tareas)
//     private tasks: any[] = [];

//     public async getTasks(): Promise<any[]> {
//         const query = `SELECT * FROM task;`;
//         const result = await this.db.query(query);

//         return result.rows;
//     }

//     // public async getTaskById(id: number): Promise<Task | null> {
//     //     const task= await this.prisma.task.findUnique({
//     //         where: {id: id},
//     //     });

//     //     return task;
//     // // public async getTaskById(id: number): Promise<any> {
    
//     //     // const query = `SELECT * FROM task WHERE id = ${id};`;
//     //     // const result = await this.db.query(query);
//     //     // return result.rows;
//     // }

//     public async getTaskById(id: number): Promise<Task | null> {
//     const task = await this.prisma.task.findUnique({
//       where: { id: id },
//     });
//     return task;
//   }

//     public async insertTask(task: CreateTaskDto): Promise<any> {
//         // const query = `INSERT INTO task (name, description, priority, user_id) VALUES ('${task.name}', '${task.description}', ${task.priority}, ${ task.user_id }) RETURNING *;`
//         // console.log(query);
//         // const result = await this.db.query(query)
//         // return result.rows;
//         const newtask = await this.prisma.task.create({
//             data: task
//         });

//         return newtask;
//     }

//     // public async updateTask(id: number, taskUpdated: UpdateTaskDto): Promise<any> {
//     // // public async updateTask(id: number, task: any): Promise<any> {
//     //     // const query = 
//     //     // `UPDATE task 
//     //     // SET name = '${task.name}', 
//     //     // description = '${task.description}', 
//     //     // priority = ${task.priority} 
//     //     // WHERE id = ${id} 
//     //     // RETURNING *;
//     //     // `
//     //     // const result = await this.db.query(query);
//     //     // return result.rows[0];
        
//     //         const task = await this.prisma,task.update(
//     //             {
//     //                 where: {id},
//     //                 data: taskUpdated
//     //             });
//     //     return task;
//     // };

//     // public deleteTask(id: number): Promise<Task> {
//     //     // const array = this.tasks.filter((data) => data.id != id)
//     //     // this.tasks = array;
//     //     // return `Task Deleted`;
//     //     const task await this.prisma.task.delete(
//     //         {
//     //             where: { id }
//     //         }
//     //     );
        
//     //     console.log(task);
//     //     return task != null : true ? false;
//     // }

//     public async updateTask(id: number, taskUpdated: any): Promise<any> {
//         // Corregido: Había una coma en lugar de un punto en this.prisma.task
//         const task = await this.prisma.task.update({
//             where: { id },
//             data: taskUpdated
//         });
//         return task;
//     };

//     public async deleteTask(id: number): Promise<boolean> {
//         // Corregido: Faltaba el signo de igual (=) después de 'task'
//         const task = await this.prisma.task.delete({
//             where: { id }
//         });
        
//         console.log(task);
//         return task != null ? true : false;
//     }

// }


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
  ) {}
  
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
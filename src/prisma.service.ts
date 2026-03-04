// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }
// }

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   constructor() {
//     // Configuramos el pool de conexiones de 'pg' usando tu variable de entorno
//     const connectionString = process.env.DATABASE_URL;
//     const pool = new Pool({ connectionString });
    
//     // Le pasamos el adaptador a Prisma
//     const adapter = new PrismaPg(pool);
//     super({ adapter });
//   }

//   async onModuleInit() {
//     await this.$connect();
//   }
// }
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
  
  async onModuleInit() {
    await this.$connect();
  }
}

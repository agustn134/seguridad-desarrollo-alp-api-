import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/common/services/utili.service';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, PrismaService, UtilService],
})
export class UserModule { }
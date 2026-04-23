import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/common/services/utili.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [AuditController],
    providers: [AuditService, PrismaService, UtilService, JwtService]
})
export class AuditModule {}

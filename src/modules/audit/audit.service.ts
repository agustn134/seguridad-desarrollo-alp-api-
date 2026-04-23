import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) {}

    public async getMyLogs(userId: number) {
        return await this.prisma.log.findMany({
            where: { user_id: userId },
            orderBy: { timestamp: 'desc' } // Los más recientes primero
        });
    }
}

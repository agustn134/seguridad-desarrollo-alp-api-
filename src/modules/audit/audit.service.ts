import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    public async getMyLogs(userId: number) {
        return await this.prisma.log.findMany({
            where: { user_id: userId },
            orderBy: { timestamp: 'desc' }
        });
    }

    public async getAllLogs(filters: any) {
        const { startDate, endDate, userId, severity } = filters;
        const whereClause: any = {};

        if (userId) whereClause.user_id = Number(userId);
        if (severity) whereClause.severity = severity;

        if (startDate && endDate) {
            whereClause.timestamp = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        return await this.prisma.log.findMany({
            where: whereClause,
            orderBy: { timestamp: 'desc' },
            include: { user: { select: { username: true } } }
        });
    }

}

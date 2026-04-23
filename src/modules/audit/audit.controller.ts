import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('audit')
@Controller('api/audit')
export class AuditController {
    constructor(private readonly auditSvc: AuditService) {}

    @UseGuards(AuthGuard)
    @Get('my-logs')
    @ApiOperation({ summary: 'Obtraer los logs de auditoria del usuario (Plus Calidad)' })
    public async getMyLogs(@Request() req: any) {
        return await this.auditSvc.getMyLogs(req.user.id);
    }
}

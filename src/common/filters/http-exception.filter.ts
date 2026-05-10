import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaClienteExcepcionesErrores } from './prisma-cliente-excepcioones-errores.filter';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

    constructor(private readonly prisma: PrismaService) { }

    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaFilter = new PrismaClienteExcepcionesErrores();
            return prismaFilter.catch(exception, host);
        }


        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse: any = exception instanceof HttpException
            ? exception.getResponse()
            : null;

        const message = exceptionResponse?.message || exceptionResponse || 'Ocurrió un error inesperado en el servidor. Intente después.';


        const user = request['user'];

        try {
            await this.prisma.log.create({
                data: {
                    action: 'EXCEPCION_HTTP',
                    severity: status >= 500 ? 'ERROR' : 'ADVERTENCIA',
                    statuscode: status,
                    timestamp: new Date(),
                    path: request.url,
                    error: typeof message === 'string' ? message : JSON.stringify(message),
                    errorCode: exception instanceof Error ? exception.name : 'Exception',
                    user_id: user ? user.id : null,
                }
            });
        } catch (error) {
            console.error('Error al guardar el log', error);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
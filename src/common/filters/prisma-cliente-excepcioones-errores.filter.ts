import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClienteExcepcionesErrores implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch (exception.code) {
            case 'P2002': {
                const status = HttpStatus.CONFLICT;
                return response.status(status).json({
                    statusCode: status,
                    message: 'El nombre de usuario ya está registrado. Por favor, elige otro.',
                    error: 'Conflict',
                });
            }
            case 'P2025': {
                const status = HttpStatus.NOT_FOUND;
                return response.status(status).json({
                    statusCode: status,
                    message: 'El registro solicitado no existe en la base de datos.',
                    error: 'Not Found',
                });
            }
            default: {
                const status = HttpStatus.BAD_REQUEST;
                return response.status(status).json({
                    statusCode: status,
                    message: 'Error de validación en la base de datos.',
                    error: 'Bad Request',
                });
            }
        }
    }
}
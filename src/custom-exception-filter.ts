import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.url;

    // Si c’est une exception HTTP (comme BadRequestException, NotFoundException, etc.)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      // Si la réponse est déjà un objet (comme dans BadRequestException custom)
      if (typeof res === 'object' && res !== null) {
        const { message, errors } = res as any;
        return response.status(status).json({
          statusCode: status,
          message: message || 'Erreur',
          errors: errors || null,
          timestamp,
          path,
        });
      }

      // Si c’est juste un message simple (string)
      return response.status(status).json({
        statusCode: status,
        message: res,
        timestamp,
        path,
      });
    }

    // Pour toute autre erreur générique (ex: throw new Error())
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Erreur interne du serveur',
      timestamp,
      path,
    });
  }
}

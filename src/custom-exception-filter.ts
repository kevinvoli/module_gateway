import { ArgumentsHost, Catch, ExceptionFilter, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class CustomTcpExceptionFilter implements RpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    console.log("ici lexeption ====:",host,exception,);
    
    // Si l'exception est une erreur de validation (BadRequestException)
    if (exception.response && exception.response.message) {
      return throwError(() => ({
        statusCode: exception.response.statusCode || 400,
        error: exception.response.error || 'Bad Request',
        message: exception.response.message,
      }));
    }

    // Pour les autres erreurs
    return throwError(() => ({
      statusCode: 500,
      error: 'Internal Server Error',
      message: exception.message || 'An unexpected error occurred.',
    }));
  }
}

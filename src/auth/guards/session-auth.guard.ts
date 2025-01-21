import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log("la request est ici");
    
    if (request.isAuthenticated()) {
      return true;
    } else {
      throw new UnauthorizedException(['unauthorized']);
    }
  }
}

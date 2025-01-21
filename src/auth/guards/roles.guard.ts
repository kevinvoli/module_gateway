import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Roles } from "../entities/roles.entity";
import { ROLES_KEY } from "src/utils/roles.decorator";




@Injectable()
export class RolesGuards implements CanActivate {
  constructor(private reflector: Reflector){}
   
  canActivate(context: ExecutionContext): boolean {
      
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // si aucun role n'est defini
    if (!requiredRoles){
      return false
    } 

    const {user} = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
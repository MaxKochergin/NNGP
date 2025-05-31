import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request || !request.user) {
      return false;
    }

    const userRoles: string[] = Array.isArray(request.user?.roles)
      ? request.user.roles
      : [];

    if (userRoles.length === 0) {
      return false;
    }

    // Проверяем, есть ли у пользователя хотя бы одна из требуемых ролей
    for (const role of requiredRoles) {
      if (userRoles.indexOf(role) >= 0) {
        return true;
      }
    }

    return false;
  }
}

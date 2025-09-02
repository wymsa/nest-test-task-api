import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { ROLES_KEY } from 'src/common/decorators/admin-required.decorator'
import { UserRole } from 'src/common/types'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this._reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    )

    const request = context.switchToHttp().getRequest<Request>()

    if (!requiredRoles) return true

    if (!request.user) return false

    if (!requiredRoles.includes(request.user.role)) return false

    return true
  }
}

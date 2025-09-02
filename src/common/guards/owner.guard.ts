import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const user = request.user
    const resourceUserID = request.params.userID

    if (user.role === 'ADMIN') return true

    if (user.userID !== Number(resourceUserID)) return false

    return true
  }
}

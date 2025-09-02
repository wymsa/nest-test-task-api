import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { DrizzleQueryError } from 'drizzle-orm'
import { Response } from 'express'

@Catch(DrizzleQueryError)
export class DrizzleQueryErrorFilter implements ExceptionFilter {
  catch(exception: DrizzleQueryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    console.log(exception)

    const pgErrorCode = (exception as any).cause.code
    const errorResponse = {
      error: 'Unknown error',
      status: HttpStatus.BAD_REQUEST,
    }

    if (pgErrorCode === '23505') {
      errorResponse.status = HttpStatus.CONFLICT
      errorResponse.error = 'Entity already exists'
    }

    if (pgErrorCode === '23502') {
      errorResponse.status = HttpStatus.UNPROCESSABLE_ENTITY
      errorResponse.error =
        'Request contains invalid data (null in non-nullable field)'
    }

    return response.status(errorResponse.status).json(errorResponse)
  }
}

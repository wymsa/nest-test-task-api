import { BadRequestException, HttpStatus } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod/v4'

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    const formattedErrors = error.issues.map(issue => {
      return { field: issue.path.join(', '), message: issue.message }
    })

    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      errors: formattedErrors,
    })
  },
}) as ReturnType<typeof createZodValidationPipe>

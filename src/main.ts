import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { DrizzleQueryErrorFilter } from 'src/common/filters/drizzle-query-error.filter'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
  })

  app.use(cookieParser())
  app.useGlobalPipes(new ZodValidationPipe())
  app.useGlobalFilters(new DrizzleQueryErrorFilter())

  const config = new DocumentBuilder()
    .setTitle('Notes Docs')
    .setDescription('The notes API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(3000)
}
bootstrap()

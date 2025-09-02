import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../database/schemas'

@Module({
  providers: [
    {
      provide: 'DatabaseConnection',
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        })

        return drizzle({
          client: pool,
          schema,
          logger: configService.get('NODE_ENV') === 'development',
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DatabaseConnection'],
})
export class DatabaseModule {}

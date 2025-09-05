import { relations } from 'drizzle-orm'
import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { notesSchema } from 'src/database/schemas'

export const roleEnum = pgEnum('user_role', ['USER', 'ADMIN'])
export const statusEnum = pgEnum('user_status', ['ACTIVE', 'BLOCKED'])

export const usersSchema = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username').notNull().unique(),
  password: varchar('password').notNull(),
  role: roleEnum('role').notNull().default('USER'),
  status: statusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const usersRelations = relations(usersSchema, ({ many }) => ({
  notes: many(notesSchema),
}))

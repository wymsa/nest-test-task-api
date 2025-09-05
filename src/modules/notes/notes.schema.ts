import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { usersSchema } from 'src/database/schemas'

export const notesSchema = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  content: text('content').notNull(),
  ownerId: integer('owner_id')
    .references(() => usersSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const notesRelations = relations(notesSchema, ({ one }) => ({
  owner: one(usersSchema, {
    fields: [notesSchema.ownerId],
    references: [usersSchema.id],
  }),
}))

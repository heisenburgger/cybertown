import { pgTable, varchar, timestamp, bigserial } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: varchar('id', {
    length: 64,
  }).unique().primaryKey(),
  username: varchar('username', {
    length: 64,
  }).notNull(),
  avatar: varchar('avatar', {
    length: 1024,
  }).notNull(),
  bio: varchar('bio', {
    length: 256,
  }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: bigserial("id", {
    mode: 'number'
  }).primaryKey(),
  userId: varchar('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type NewUser = typeof users.$inferInsert;
export type NewSession = typeof sessions.$inferInsert;

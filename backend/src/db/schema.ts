import { pgTable, varchar, timestamp, serial, pgEnum, integer, primaryKey } from 'drizzle-orm/pg-core'

// TODO: migration file doesn't contain this?
const authProviderEnum = pgEnum('provider', ['google', 'github'])

export const users = pgTable('users', {
  id: serial("id").primaryKey(),
  username: varchar('username', {
    length: 64,
  }).notNull(),
  avatar: varchar('avatar', {
    length: 1024,
  }).notNull(),
  bio: varchar('bio', {
    length: 256,
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const authProviders = pgTable("auth_providers", {
  provider: authProviderEnum('provider').notNull(),
  userId: integer('user_id').notNull().references(() => users.id),
  key: varchar('key', {
    length: 128,
  }).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.provider, table.key]})
}))

export const sessions = pgTable('sessions', {
  id: serial("id").primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type NewUser = typeof users.$inferInsert;
export type NewSession = typeof sessions.$inferInsert;
export type NewAuthProvider = typeof authProviders.$inferInsert;

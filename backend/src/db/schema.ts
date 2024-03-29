import { pgTable, varchar, timestamp, serial, pgEnum, integer, primaryKey, jsonb, smallint } from 'drizzle-orm/pg-core'
import { RoomMetadata } from '@/types/entity'

// TODO: migration file doesn't contain this?
export const authProviderEnum = pgEnum('provider', ['google', 'github'])

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

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  topic: varchar("topic", {
    length: 256,
  }),
  language: varchar("language", {
    length: 256,
  }).notNull(),
  maxParticipants: smallint("max_participants").notNull(),
  metadata: jsonb("metadata").notNull().$type<RoomMetadata>(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

import {
  pgTable,
  unique,
  pgEnum,
  text,
  varchar,
  timestamp,
  integer,
  vector,
  index,
  pgSchema,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const access_token_status = pgEnum('access_token_status', ['active', 'inactive']);
export const client_status = pgEnum('client_status', ['disabled', 'active', 'pending']);
export const document_type = pgEnum('document_type', [
  'pdf',
  'ppt',
  'pptx',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'txt',
  'md',
  'csv',
  'rtf',
  'json',
  'image',
]);

export const access_tokens = pgTable(
  'access_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    client_id: uuid('client_id')
      .notNull()
      .references(() => clients.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull(),
    description: text('description'),
    status: access_token_status('status').default('active').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }),
  },
  (table) => {
    return {
      access_tokens_token_unique: unique('access_tokens_token_unique').on(table.token),
    };
  }
);

export const users = pgSchema('auth').table('users', {
  id: uuid('id').primaryKey(),
});

export const clients = pgTable(
  'clients',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    user_id: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    api_key: varchar('api_key', { length: 255 }),
    status: client_status('status').default('active').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      clients_api_key_unique: unique('clients_api_key_unique').on(table.api_key),
      clients_name_user_unique: unique('clients_name_user_unique').on(table.name, table.user_id),
    };
  }
);

export const document_versions = pgTable('document_versions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  document_id: uuid('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  storage_url: varchar('storage_url', { length: 1024 }),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  client_id: uuid('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: document_type('type').notNull(),
  storage_url: varchar('storage_url', { length: 1024 }),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

export const embeddings = pgTable(
  'embeddings',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    document_version_id: uuid('document_version_id')
      .notNull()
      .references(() => document_versions.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => ({
    embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  })
);

export const clientsSchema = createInsertSchema(clients);
export const clientsSelectSchema = createSelectSchema(clients);
export const access_tokensSchema = createInsertSchema(access_tokens);
export const access_tokensSelectSchema = createSelectSchema(access_tokens);
export type Client = z.infer<typeof clientsSelectSchema>;
export type ClientInsert = z.infer<typeof clientsSchema>;
export type AccessToken = z.infer<typeof access_tokensSelectSchema>;
export type AccessTokenInsert = z.infer<typeof access_tokensSchema>;
export type DocumentType = (typeof document_type.enumValues)[number];

export const documentsSchema = createInsertSchema(documents);
export const documentsSelectSchema = createSelectSchema(documents);
export type Document = z.infer<typeof documentsSelectSchema>;
export type DocumentInsert = z.infer<typeof documentsSchema>;

export const document_versionsSchema = createInsertSchema(document_versions);
export const document_versionsSelectSchema = createSelectSchema(document_versions);
export type DocumentVersion = z.infer<typeof document_versionsSelectSchema>;
export type DocumentVersionInsert = z.infer<typeof document_versionsSchema>;

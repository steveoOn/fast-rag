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
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

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
    id: varchar('id', { length: 255 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    client_id: varchar('client_id', { length: 255 })
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

export const clients = pgTable(
  'clients',
  {
    id: varchar('id', { length: 255 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    api_key: varchar('api_key', { length: 255 }).notNull(),
    status: client_status('status').default('pending').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      clients_api_key_unique: unique('clients_api_key_unique').on(table.api_key),
    };
  }
);

export const document_versions = pgTable('document_versions', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  document_id: varchar('document_id', { length: 255 })
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  storage_url: varchar('storage_url', { length: 1024 }),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  client_id: varchar('client_id', { length: 255 })
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
    id: varchar('id', { length: 255 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    document_version_id: varchar('document_version_id', { length: 255 })
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

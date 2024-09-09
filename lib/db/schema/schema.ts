import { pgTable, unique, pgEnum, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const aal_level = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const code_challenge_method = pgEnum('code_challenge_method', ['s256', 'plain']);
export const factor_status = pgEnum('factor_status', ['unverified', 'verified']);
export const factor_type = pgEnum('factor_type', ['totp', 'webauthn', 'phone']);
export const one_time_token_type = pgEnum('one_time_token_type', [
  'confirmation_token',
  'reauthentication_token',
  'recovery_token',
  'email_change_token_new',
  'email_change_token_current',
  'phone_change_token',
]);
export const key_status = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired']);
export const key_type = pgEnum('key_type', [
  'aead-ietf',
  'aead-det',
  'hmacsha512',
  'hmacsha256',
  'auth',
  'shorthash',
  'generichash',
  'kdf',
  'secretbox',
  'secretstream',
  'stream_xchacha20',
]);
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
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    client_id: text('client_id')
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
    id: text('id')
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
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  document_id: text('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  storage_url: varchar('storage_url', { length: 1024 }),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  client_id: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: document_type('type').notNull(),
  storage_url: varchar('storage_url', { length: 1024 }),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

export const embeddings = pgTable('embeddings', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  document_version_id: text('document_version_id')
    .notNull()
    .references(() => document_versions.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  embedding: varchar('embedding', { length: 1536 }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

import {
  pgTable,
  foreignKey,
  unique,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
  index,
  vector,
  pgSequence,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const accessTokenStatus = pgEnum('access_token_status', ['active', 'inactive']);
export const clientStatus = pgEnum('client_status', ['disabled', 'active', 'pending']);
export const documentType = pgEnum('document_type', [
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

export const cuidSequence = pgSequence('cuid_sequence', {
  startWith: '1',
  increment: '1',
  minValue: '1',
  maxValue: '9223372036854775807',
  cache: '1',
  cycle: false,
});

export const clients = pgTable(
  'clients',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    apiKey: varchar('api_key', { length: 255 }),
    status: clientStatus('status').default('active').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      clientsUserIdUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'clients_user_id_users_id_fk',
      }),
      clientsNameUserUnique: unique('clients_name_user_unique').on(table.userId, table.name),
      clientsApiKeyUnique: unique('clients_api_key_unique').on(table.apiKey),
    };
  }
);

export const accessTokens = pgTable(
  'access_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    clientId: uuid('client_id').notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    description: text('description'),
    status: accessTokenStatus('status').default('active').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { mode: 'string' }),
  },
  (table) => {
    return {
      accessTokensClientIdClientsIdFk: foreignKey({
        columns: [table.clientId],
        foreignColumns: [clients.id],
        name: 'access_tokens_client_id_clients_id_fk',
      }).onDelete('cascade'),
      accessTokensTokenUnique: unique('access_tokens_token_unique').on(table.token),
    };
  }
);

export const documents = pgTable(
  'documents',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    clientId: uuid('client_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: documentType('type').notNull(),
    storageUrl: varchar('storage_url', { length: 1024 }),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      documentsClientIdClientsIdFk: foreignKey({
        columns: [table.clientId],
        foreignColumns: [clients.id],
        name: 'documents_client_id_clients_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const documentVersions = pgTable(
  'document_versions',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    documentId: uuid('document_id').notNull(),
    version: integer('version').notNull(),
    storageUrl: varchar('storage_url', { length: 1024 }),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      documentVersionsDocumentIdDocumentsIdFk: foreignKey({
        columns: [table.documentId],
        foreignColumns: [documents.id],
        name: 'document_versions_document_id_documents_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const embeddings = pgTable(
  'embeddings',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    documentVersionId: uuid('document_version_id').notNull(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      embeddingIndex: index('embeddingIndex').using(
        'hnsw',
        table.embedding.asc().nullsLast().op('vector_cosine_ops')
      ),
      embeddingsDocumentVersionIdDocumentVersionsIdFk: foreignKey({
        columns: [table.documentVersionId],
        foreignColumns: [documentVersions.id],
        name: 'embeddings_document_version_id_document_versions_id_fk',
      }).onDelete('cascade'),
    };
  }
);

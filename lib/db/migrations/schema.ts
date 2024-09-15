import {
  pgTable,
  foreignKey,
  unique,
  varchar,
  text,
  timestamp,
  integer,
  index,
  vector,
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

export const accessTokens = pgTable(
  'access_tokens',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    clientId: varchar('client_id', { length: 255 }).notNull(),
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

export const clients = pgTable(
  'clients',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    apiKey: varchar('api_key', { length: 255 }),
    status: clientStatus('status').default('pending').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      clientsNameUnique: unique('clients_name_unique').on(table.name),
      clientsApiKeyUnique: unique('clients_api_key_unique').on(table.apiKey),
    };
  }
);

export const documentVersions = pgTable(
  'document_versions',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    documentId: varchar('document_id', { length: 255 }).notNull(),
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

export const documents = pgTable(
  'documents',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    clientId: varchar('client_id', { length: 255 }).notNull(),
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

export const embeddings = pgTable(
  'embeddings',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    documentVersionId: varchar('document_version_id', { length: 255 }).notNull(),
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

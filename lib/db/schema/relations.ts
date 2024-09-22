import { relations } from 'drizzle-orm/relations';
import { clients, users, access_tokens, documents, document_versions, embeddings } from './schema';

export const access_tokensRelations = relations(access_tokens, ({ one }) => ({
  client: one(clients, {
    fields: [access_tokens.client_id],
    references: [clients.id],
  }),
}));

export const clientsRelations = relations(clients, ({ many, one }) => ({
  access_tokens: many(access_tokens),
  documents: many(documents),
  user: one(users, {
    fields: [clients.user_id],
    references: [users.id],
  }),
}));

export const document_versionsRelations = relations(document_versions, ({ one, many }) => ({
  document: one(documents, {
    fields: [document_versions.document_id],
    references: [documents.id],
  }),
  embeddings: many(embeddings),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  document_versions: many(document_versions),
  client: one(clients, {
    fields: [documents.client_id],
    references: [clients.id],
  }),
}));

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  document_version: one(document_versions, {
    fields: [embeddings.document_version_id],
    references: [document_versions.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  clients: many(clients),
}));

import { relations } from 'drizzle-orm/relations';
import { clients, accessTokens, documents, documentVersions, embeddings } from './schema';

export const accessTokensRelations = relations(accessTokens, ({ one }) => ({
  client: one(clients, {
    fields: [accessTokens.clientId],
    references: [clients.id],
  }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  accessTokens: many(accessTokens),
  documents: many(documents),
}));

export const documentVersionsRelations = relations(documentVersions, ({ one, many }) => ({
  document: one(documents, {
    fields: [documentVersions.documentId],
    references: [documents.id],
  }),
  embeddings: many(embeddings),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  documentVersions: many(documentVersions),
  client: one(clients, {
    fields: [documents.clientId],
    references: [clients.id],
  }),
}));

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  documentVersion: one(documentVersions, {
    fields: [embeddings.documentVersionId],
    references: [documentVersions.id],
  }),
}));

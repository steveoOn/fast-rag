import { relations } from 'drizzle-orm/relations';
import {
  usersInAuth,
  clients,
  accessTokens,
  documents,
  documentVersions,
  embeddings,
} from './schema';

export const clientsRelations = relations(clients, ({ one, many }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [clients.userId],
    references: [usersInAuth.id],
  }),
  accessTokens: many(accessTokens),
  documents: many(documents),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  clients: many(clients),
}));

export const accessTokensRelations = relations(accessTokens, ({ one }) => ({
  client: one(clients, {
    fields: [accessTokens.clientId],
    references: [clients.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  client: one(clients, {
    fields: [documents.clientId],
    references: [clients.id],
  }),
  documentVersions: many(documentVersions),
}));

export const documentVersionsRelations = relations(documentVersions, ({ one, many }) => ({
  document: one(documents, {
    fields: [documentVersions.documentId],
    references: [documents.id],
  }),
  embeddings: many(embeddings),
}));

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  documentVersion: one(documentVersions, {
    fields: [embeddings.documentVersionId],
    references: [documentVersions.id],
  }),
}));

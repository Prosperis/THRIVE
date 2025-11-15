import { GraphQLError } from 'graphql';
import { documents as documentsDb } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import type {
  Context,
  CreateDocumentArgs,
  DeleteDocumentArgs,
  DocumentQueryArgs,
  DocumentRecord,
  UpdateDocumentArgs,
} from '../types';

export const documentsResolver = {
  Query: {
    documents: async (_: unknown, __: unknown, { userId }: Context) => {
      try {
        return await documentsDb.getAll(userId);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch documents: ${error}`);
      }
    },

    document: async (_: unknown, { id }: DocumentQueryArgs, { userId }: Context) => {
      try {
        return await documentsDb.getById(id, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch document: ${error}`);
      }
    },

    documentsByApplication: async (
      _: unknown,
      { applicationId }: { applicationId: string },
      { userId }: Context
    ) => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('application_id', applicationId)
          .eq('user_id', userId)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch documents by application: ${error}`);
      }
    },

    documentVersions: async (
      _: unknown,
      { baseDocumentId }: { baseDocumentId: string },
      { userId }: Context
    ) => {
      try {
        return await documentsDb.getVersions(baseDocumentId, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch document versions: ${error}`);
      }
    },
  },

  Mutation: {
    createDocument: async (_: unknown, { input }: CreateDocumentArgs, { userId }: Context) => {
      try {
        const documentData = {
          ...input,
          user_id: userId,
          // Convert GraphQL field names to database column names
          file_name: input.fileName,
          file_url: input.fileUrl,
          file_size: input.fileSize,
          mime_type: input.mimeType,
          base_document_id: input.baseDocumentId,
          application_id: input.applicationId,
          used_in_application_ids: input.usedInApplicationIds,
          last_used_date: input.lastUsedDate,
          deleted_at: input.deletedAt,
        };

        return await documentsDb.create(documentData);
      } catch (error) {
        throw new GraphQLError(`Failed to create document: ${error}`);
      }
    },

    updateDocument: async (_: unknown, { id, input }: UpdateDocumentArgs, { userId }: Context) => {
      try {
        const updateData = {
          ...input,
          // Convert GraphQL field names to database column names
          file_name: input.fileName,
          file_url: input.fileUrl,
          file_size: input.fileSize,
          mime_type: input.mimeType,
          base_document_id: input.baseDocumentId,
          application_id: input.applicationId,
          used_in_application_ids: input.usedInApplicationIds,
          last_used_date: input.lastUsedDate,
          deleted_at: input.deletedAt,
        };

        return await documentsDb.update(id, updateData, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to update document: ${error}`);
      }
    },

    deleteDocument: async (_: unknown, { id }: DeleteDocumentArgs, { userId }: Context) => {
      try {
        return await documentsDb.delete(id, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to delete document: ${error}`);
      }
    },
  },

  Document: {
    userId: (parent: DocumentRecord) => parent.user_id,
    fileName: (parent: DocumentRecord) => parent.file_name,
    fileUrl: (parent: DocumentRecord) => parent.file_url,
    fileSize: (parent: DocumentRecord) => parent.file_size,
    mimeType: (parent: DocumentRecord) => parent.mime_type,
    baseDocumentId: (parent: DocumentRecord) => parent.base_document_id,
    applicationId: (parent: DocumentRecord) => parent.application_id,
    usedInApplicationIds: (parent: DocumentRecord) => parent.used_in_application_ids,
    lastUsedDate: (parent: DocumentRecord) => parent.last_used_date,
    deletedAt: (parent: DocumentRecord) => parent.deleted_at,
    createdAt: (parent: DocumentRecord) => parent.created_at,
    updatedAt: (parent: DocumentRecord) => parent.updated_at,

    application: async (parent: DocumentRecord, _: unknown, { userId }: Context) => {
      if (!parent.application_id) return null;

      const { applications } = await import('../../lib/db');
      return await applications.getById(parent.application_id, userId);
    },

    baseDocument: async (parent: DocumentRecord, _: unknown, { userId }: Context) => {
      if (!parent.base_document_id) return null;

      return await documentsDb.getById(parent.base_document_id, userId);
    },

    versions: async (parent: DocumentRecord, _: unknown, { userId }: Context) => {
      return await documentsDb.getVersions(parent.id, userId);
    },
  },
};

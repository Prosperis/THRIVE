import { GraphQLError } from 'graphql';
import { contacts as contactsDb } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import type {
  ContactQueryArgs,
  ContactRecord,
  Context,
  CreateContactArgs,
  DeleteContactArgs,
  UpdateContactArgs,
} from '../types';

export const contactsResolver = {
  Query: {
    contacts: async (_: unknown, __: unknown, { userId }: Context) => {
      try {
        return await contactsDb.getAll(userId);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch contacts: ${error}`);
      }
    },

    contact: async (_: unknown, { id }: ContactQueryArgs, { userId }: Context) => {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch contact: ${error}`);
      }
    },

    contactsByCompany: async (
      _: unknown,
      { companyId }: { companyId: string },
      { userId }: Context
    ) => {
      try {
        return await contactsDb.getByCompanyId(companyId, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch contacts by company: ${error}`);
      }
    },
  },

  Mutation: {
    createContact: async (_: unknown, { input }: CreateContactArgs, { userId }: Context) => {
      try {
        const contactData = {
          ...input,
          user_id: userId,
          // Convert GraphQL field names to database column names
          company_id: input.companyId,
          company_name: input.companyName,
        };

        return await contactsDb.create(contactData);
      } catch (error) {
        throw new GraphQLError(`Failed to create contact: ${error}`);
      }
    },

    updateContact: async (_: unknown, { id, input }: UpdateContactArgs, { userId }: Context) => {
      try {
        const updateData = {
          ...input,
          // Convert GraphQL field names to database column names
          company_id: input.companyId,
          company_name: input.companyName,
        };

        return await contactsDb.update(id, updateData, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to update contact: ${error}`);
      }
    },

    deleteContact: async (_: unknown, { id }: DeleteContactArgs, { userId }: Context) => {
      try {
        return await contactsDb.delete(id, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to delete contact: ${error}`);
      }
    },
  },

  Contact: {
    userId: (parent: ContactRecord) => parent.user_id,
    companyId: (parent: ContactRecord) => parent.company_id,
    companyName: (parent: ContactRecord) => parent.company_name,
    createdAt: (parent: ContactRecord) => parent.created_at,
    updatedAt: (parent: ContactRecord) => parent.updated_at,

    company: async (parent: ContactRecord, _: unknown, { userId }: Context) => {
      if (!parent.company_id) return null;

      const { companies } = await import('../../lib/db');
      return await companies.getById(parent.company_id, userId);
    },
  },
};

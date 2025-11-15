import { GraphQLError } from 'graphql';
import { interviews as interviewsDb } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import type {
  Context,
  CreateInterviewArgs,
  DeleteInterviewArgs,
  InterviewQueryArgs,
  InterviewRecord,
  UpdateInterviewArgs,
} from '../types';

export const interviewsResolver = {
  Query: {
    interviews: async (_: unknown, __: unknown, { userId }: Context) => {
      try {
        return await interviewsDb.getAll(userId);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch interviews: ${error}`);
      }
    },

    interview: async (_: unknown, { id }: InterviewQueryArgs, { userId }: Context) => {
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch interview: ${error}`);
      }
    },

    interviewsByApplication: async (
      _: unknown,
      { applicationId }: { applicationId: string },
      { userId }: Context
    ) => {
      try {
        return await interviewsDb.getByApplicationId(applicationId, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch interviews by application: ${error}`);
      }
    },
  },

  Mutation: {
    createInterview: async (_: unknown, { input }: CreateInterviewArgs, { userId }: Context) => {
      try {
        const interviewData = {
          ...input,
          user_id: userId,
          // Convert GraphQL enum values to database values
          scheduled_at: input.scheduledAt,
          preparation_notes: input.preparationNotes,
          questions_asked: input.questionsAsked,
          questions_to_ask: input.questionsToAsk,
          follow_up_sent: input.followUpSent,
          follow_up_date: input.followUpDate,
        };

        return await interviewsDb.create(interviewData);
      } catch (error) {
        throw new GraphQLError(`Failed to create interview: ${error}`);
      }
    },

    updateInterview: async (
      _: unknown,
      { id, input }: UpdateInterviewArgs,
      { userId }: Context
    ) => {
      try {
        const updateData = {
          ...input,
          // Convert GraphQL enum values to database values
          scheduled_at: input.scheduledAt,
          preparation_notes: input.preparationNotes,
          questions_asked: input.questionsAsked,
          questions_to_ask: input.questionsToAsk,
          follow_up_sent: input.followUpSent,
          follow_up_date: input.followUpDate,
        };

        return await interviewsDb.update(id, updateData, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to update interview: ${error}`);
      }
    },

    deleteInterview: async (_: unknown, { id }: DeleteInterviewArgs, { userId }: Context) => {
      try {
        return await interviewsDb.delete(id, userId);
      } catch (error) {
        throw new GraphQLError(`Failed to delete interview: ${error}`);
      }
    },
  },

  Interview: {
    userId: (parent: InterviewRecord) => parent.user_id,
    applicationId: (parent: InterviewRecord) => parent.application_id,
    scheduledAt: (parent: InterviewRecord) => parent.scheduled_at,
    preparationNotes: (parent: InterviewRecord) => parent.preparation_notes,
    questionsAsked: (parent: InterviewRecord) => parent.questions_asked,
    questionsToAsk: (parent: InterviewRecord) => parent.questions_to_ask,
    followUpSent: (parent: InterviewRecord) => parent.follow_up_sent,
    followUpDate: (parent: InterviewRecord) => parent.follow_up_date,
    createdAt: (parent: InterviewRecord) => parent.created_at,
    updatedAt: (parent: InterviewRecord) => parent.updated_at,

    application: async (parent: InterviewRecord, _: unknown, { userId }: Context) => {
      const { applications } = await import('../../lib/db');
      return await applications.getById(parent.application_id, userId);
    },

    interviewers: async (parent: InterviewRecord, _: unknown, _context: Context) => {
      // Interviewers are stored as JSON in the interview record
      return parent.interviewers || [];
    },
  },
};

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Interview } from '@/types';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

interface InterviewsState {
  interviews: Interview[];
  selectedInterviewId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchInterviews: () => Promise<void>;
  addInterview: (interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateInterview: (id: string, updates: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  getInterviewsByApplication: (applicationId: string) => Interview[];
  getUpcomingInterviews: () => Interview[];
  getPastInterviews: () => Interview[];
  setSelectedInterview: (id: string | null) => void;
  clearError: () => void;
}

export const useInterviewsStore = create<InterviewsState>()(
  devtools(
    (set, get) => ({
      interviews: [],
      selectedInterviewId: null,
      isLoading: false,
      error: null,

      fetchInterviews: async () => {
        set({ isLoading: true, error: null });
        try {
          const interviews = await db.interviews.toArray();
          set({ interviews, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch interviews',
            isLoading: false,
          });
        }
      },

      addInterview: async (interview) => {
        set({ isLoading: true, error: null });
        try {
          const newInterview: Interview = {
            ...interview,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await db.interviews.add(newInterview);
          set((state) => ({
            interviews: [...state.interviews, newInterview],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add interview',
            isLoading: false,
          });
          throw error;
        }
      },

      updateInterview: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedData = {
            ...updates,
            updatedAt: new Date(),
          };

          await db.interviews.update(id, updatedData);
          set((state) => ({
            interviews: state.interviews.map((interview) =>
              interview.id === id ? { ...interview, ...updatedData } : interview
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update interview',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteInterview: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await db.interviews.delete(id);
          set((state) => ({
            interviews: state.interviews.filter((interview) => interview.id !== id),
            selectedInterviewId:
              state.selectedInterviewId === id ? null : state.selectedInterviewId,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete interview',
            isLoading: false,
          });
          throw error;
        }
      },

      getInterviewsByApplication: (applicationId) => {
        return get().interviews.filter((interview) => interview.applicationId === applicationId);
      },

      getUpcomingInterviews: () => {
        const now = new Date();
        return get()
          .interviews.filter(
            (interview) =>
              interview.scheduledAt &&
              interview.scheduledAt > now &&
              (interview.status === 'scheduled' || interview.status === 'rescheduled')
          )
          .sort((a, b) => (a.scheduledAt?.getTime() || 0) - (b.scheduledAt?.getTime() || 0));
      },

      getPastInterviews: () => {
        const now = new Date();
        return get()
          .interviews.filter(
            (interview) =>
              (interview.scheduledAt && interview.scheduledAt <= now) ||
              interview.status === 'completed'
          )
          .sort((a, b) => (b.scheduledAt?.getTime() || 0) - (a.scheduledAt?.getTime() || 0));
      },

      setSelectedInterview: (id) => {
        set({ selectedInterviewId: id });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'InterviewsStore' }
  )
);

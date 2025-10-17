import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Application, ApplicationFilters } from '@/types';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

interface ApplicationsState {
  applications: Application[];
  filters: ApplicationFilters;
  selectedApplicationId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchApplications: () => Promise<void>;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ApplicationFilters>) => void;
  setSelectedApplication: (id: string | null) => void;
  clearError: () => void;
}

export const useApplicationsStore = create<ApplicationsState>()(
  devtools(
    persist(
      (set, _get) => ({
        applications: [],
        filters: {},
        selectedApplicationId: null,
        isLoading: false,
        error: null,

        fetchApplications: async () => {
          set({ isLoading: true, error: null });
          try {
            const applications = await db.applications.toArray();
            set({ applications, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch applications',
              isLoading: false,
            });
          }
        },

        addApplication: async (application) => {
          set({ isLoading: true, error: null });
          try {
            const newApplication: Application = {
              ...application,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            await db.applications.add(newApplication);
            set((state) => ({
              applications: [...state.applications, newApplication],
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to add application',
              isLoading: false,
            });
            throw error;
          }
        },

        updateApplication: async (id, updates) => {
          set({ isLoading: true, error: null });
          try {
            const updatedData = {
              ...updates,
              updatedAt: new Date(),
            };

            await db.applications.update(id, updatedData);
            set((state) => ({
              applications: state.applications.map((app) =>
                app.id === id ? { ...app, ...updatedData } : app
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update application',
              isLoading: false,
            });
            throw error;
          }
        },

        deleteApplication: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await db.applications.delete(id);
            set((state) => ({
              applications: state.applications.filter((app) => app.id !== id),
              selectedApplicationId:
                state.selectedApplicationId === id ? null : state.selectedApplicationId,
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete application',
              isLoading: false,
            });
            throw error;
          }
        },

        setFilters: (filters) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
          }));
        },

        setSelectedApplication: (id) => {
          set({ selectedApplicationId: id });
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'applications-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'ApplicationsStore' }
  )
);

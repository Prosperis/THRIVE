import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { Application, ApplicationFilters } from '@/types';

interface ApplicationsState {
  applications: Application[];
  filters: ApplicationFilters;
  selectedApplicationId: string | null;
  isLoading: boolean;
  error: string | null;

  // Getters
  getFilteredApplications: () => Application[];

  // Actions
  fetchApplications: () => Promise<void>;
  addApplication: (
    application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<Application>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  clearApplications: () => Promise<void>;
  setFilters: (filters: Partial<ApplicationFilters>) => void;
  setSelectedApplication: (id: string | null) => void;
  clearError: () => void;
}

export const useApplicationsStore = create<ApplicationsState>()(
  devtools(
    persist(
      (set, get) => ({
        applications: [],
        filters: {},
        selectedApplicationId: null,
        isLoading: false,
        error: null,

        getFilteredApplications: () => {
          const { applications, filters } = get();

          return applications.filter((app) => {
            // Filter by search query
            if (filters.searchQuery?.trim()) {
              const query = filters.searchQuery.toLowerCase();
              const matchesPosition = app.position.toLowerCase().includes(query);
              const matchesCompany = app.companyName.toLowerCase().includes(query);
              const matchesLocation = app.location?.toLowerCase().includes(query);

              if (!matchesPosition && !matchesCompany && !matchesLocation) {
                return false;
              }
            }

            // Filter by status
            if (filters.status && filters.status.length > 0) {
              if (!filters.status.includes(app.status)) {
                return false;
              }
            }

            // Filter by priority
            if (filters.priority && filters.priority.length > 0) {
              if (!app.priority || !filters.priority.includes(app.priority)) {
                return false;
              }
            }

            // Filter by work type
            if (filters.workType && filters.workType.length > 0) {
              if (!app.workType || !filters.workType.includes(app.workType)) {
                return false;
              }
            }

            // Filter by employment type
            if (filters.employmentType && filters.employmentType.length > 0) {
              if (!app.employmentType || !filters.employmentType.includes(app.employmentType)) {
                return false;
              }
            }

            // Filter by date range
            if (filters.dateRange?.start && app.appliedDate) {
              const appliedDate = new Date(app.appliedDate);
              const fromDate = new Date(filters.dateRange.start);
              if (appliedDate < fromDate) {
                return false;
              }
            }

            if (filters.dateRange?.end && app.appliedDate) {
              const appliedDate = new Date(app.appliedDate);
              const toDate = new Date(filters.dateRange.end);
              // Set to end of day
              toDate.setHours(23, 59, 59, 999);
              if (appliedDate > toDate) {
                return false;
              }
            }

            // Filter by salary range
            if (filters.salaryRange && app.salary) {
              const { min: filterMin, max: filterMax } = filters.salaryRange;
              const { min: appMin, max: appMax } = app.salary;

              // Check if there's any overlap between filter range and app salary range
              // App salary range must overlap with filter range
              if (appMin !== undefined && appMax !== undefined) {
                // No overlap if app max is less than filter min, or app min is greater than filter max
                if (appMax < filterMin || appMin > filterMax) {
                  return false;
                }
              }
            }

            return true;
          });
        },

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

            return newApplication;
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

        clearApplications: async () => {
          set({ isLoading: true, error: null });
          try {
            await db.applications.clear();
            set({
              applications: [],
              selectedApplicationId: null,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to clear applications',
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

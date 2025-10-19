import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { Company } from '@/types';

interface CompaniesState {
  companies: Company[];
  selectedCompanyId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  setSelectedCompany: (id: string | null) => void;
  clearError: () => void;
}

export const useCompaniesStore = create<CompaniesState>()(
  devtools(
    persist(
      (set) => ({
        companies: [],
        selectedCompanyId: null,
        isLoading: false,
        error: null,

        fetchCompanies: async () => {
          set({ isLoading: true, error: null });
          try {
            const companies = await db.companies.toArray();
            set({ companies, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch companies',
              isLoading: false,
            });
          }
        },

        addCompany: async (companyData) => {
          set({ isLoading: true, error: null });
          try {
            const now = new Date();
            const company: Company = {
              ...companyData,
              id: generateId(),
              createdAt: now,
              updatedAt: now,
            };

            await db.companies.add(company);
            set((state) => ({
              companies: [...state.companies, company],
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to add company',
              isLoading: false,
            });
            throw error;
          }
        },

        updateCompany: async (id, updates) => {
          set({ isLoading: true, error: null });
          try {
            const updatedCompany = {
              ...updates,
              updatedAt: new Date(),
            };

            await db.companies.update(id, updatedCompany);
            set((state) => ({
              companies: state.companies.map((company) =>
                company.id === id ? { ...company, ...updatedCompany } : company
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update company',
              isLoading: false,
            });
            throw error;
          }
        },

        deleteCompany: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await db.companies.delete(id);
            set((state) => ({
              companies: state.companies.filter((company) => company.id !== id),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete company',
              isLoading: false,
            });
            throw error;
          }
        },

        setSelectedCompany: (id) => {
          set({ selectedCompanyId: id });
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'companies-storage',
        partialize: (state) => ({
          companies: state.companies,
          selectedCompanyId: state.selectedCompanyId,
        }),
      }
    ),
    { name: 'CompaniesStore' }
  )
);

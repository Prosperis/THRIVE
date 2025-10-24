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
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  setSelectedCompany: (id: string | null) => void;
  clearError: () => void;

  // Enhanced Actions
  toggleResearched: (id: string) => Promise<void>;
  updateRating: (
    id: string,
    category: keyof NonNullable<Company['ratings']>,
    value: number
  ) => Promise<void>;
  linkApplication: (companyId: string, applicationId: string) => Promise<void>;
  unlinkApplication: (companyId: string, applicationId: string) => Promise<void>;
  linkContact: (companyId: string, contactId: string) => Promise<void>;
  unlinkContact: (companyId: string, contactId: string) => Promise<void>;
  linkDocument: (companyId: string, documentId: string) => Promise<void>;
  unlinkDocument: (companyId: string, documentId: string) => Promise<void>;
  linkInterview: (companyId: string, interviewId: string) => Promise<void>;
  unlinkInterview: (companyId: string, interviewId: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: Company['status']) => Promise<void>;
  bulkUpdatePriority: (ids: string[], priority: Company['priority']) => Promise<void>;
  bulkToggleResearched: (ids: string[], researched: boolean) => Promise<void>;
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
              researched: companyData.researched ?? false,
              applicationIds: companyData.applicationIds ?? [],
            };

            await db.companies.add(company);
            set((state) => ({
              companies: [...state.companies, company],
              isLoading: false,
            }));
            return company;
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

        // Enhanced Actions
        toggleResearched: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(id);
            if (!company) throw new Error('Company not found');

            const updated = { researched: !company.researched, updatedAt: new Date() };
            await db.companies.update(id, updated);

            set((state) => ({
              companies: state.companies.map((c) => (c.id === id ? { ...c, ...updated } : c)),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to toggle researched',
              isLoading: false,
            });
            throw error;
          }
        },

        updateRating: async (id, category, value) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(id);
            if (!company) throw new Error('Company not found');

            const updated = {
              ratings: { ...company.ratings, [category]: value },
              updatedAt: new Date(),
            };
            await db.companies.update(id, updated);

            set((state) => ({
              companies: state.companies.map((c) => (c.id === id ? { ...c, ...updated } : c)),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update rating',
              isLoading: false,
            });
            throw error;
          }
        },

        linkApplication: async (companyId, applicationId) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(companyId);
            if (!company) throw new Error('Company not found');

            const applicationIds = [...(company.applicationIds || [])];
            if (!applicationIds.includes(applicationId)) {
              applicationIds.push(applicationId);
              const updated = { applicationIds, updatedAt: new Date() };
              await db.companies.update(companyId, updated);

              set((state) => ({
                companies: state.companies.map((c) =>
                  c.id === companyId ? { ...c, ...updated } : c
                ),
                isLoading: false,
              }));
            } else {
              set({ isLoading: false });
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to link application',
              isLoading: false,
            });
            throw error;
          }
        },

        unlinkApplication: async (companyId, applicationId) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(companyId);
            if (!company) throw new Error('Company not found');

            const applicationIds = (company.applicationIds || []).filter(
              (id) => id !== applicationId
            );
            const updated = { applicationIds, updatedAt: new Date() };
            await db.companies.update(companyId, updated);

            set((state) => ({
              companies: state.companies.map((c) =>
                c.id === companyId ? { ...c, ...updated } : c
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to unlink application',
              isLoading: false,
            });
            throw error;
          }
        },

        linkContact: async (companyId, contactId) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(companyId);
            if (!company) throw new Error('Company not found');

            const contactIds = [...(company.contactIds || [])];
            if (!contactIds.includes(contactId)) {
              contactIds.push(contactId);
              const updated = { contactIds, updatedAt: new Date() };
              await db.companies.update(companyId, updated);

              set((state) => ({
                companies: state.companies.map((c) =>
                  c.id === companyId ? { ...c, ...updated } : c
                ),
                isLoading: false,
              }));
            } else {
              set({ isLoading: false });
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to link contact',
              isLoading: false,
            });
            throw error;
          }
        },

        unlinkContact: async (companyId, contactId) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(companyId);
            if (!company) throw new Error('Company not found');

            const contactIds = (company.contactIds || []).filter((id) => id !== contactId);
            const updated = { contactIds, updatedAt: new Date() };
            await db.companies.update(companyId, updated);

            set((state) => ({
              companies: state.companies.map((c) =>
                c.id === companyId ? { ...c, ...updated } : c
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to unlink contact',
              isLoading: false,
            });
            throw error;
          }
        },

        linkDocument: async (companyId, documentId) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(companyId);
            if (!company) throw new Error('Company not found');

            const documentIds = [...(company.documentIds || [])];
            if (!documentIds.includes(documentId)) {
              documentIds.push(documentId);
              const updated = { documentIds, updatedAt: new Date() };
              await db.companies.update(companyId, updated);

              set((state) => ({
                companies: state.companies.map((c) =>
                  c.id === companyId ? { ...c, ...updated } : c
                ),
                isLoading: false,
              }));
            } else {
              set({ isLoading: false });
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to link document',
              isLoading: false,
            });
            throw error;
          }
        },

        unlinkDocument: async (companyId, documentId) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(companyId);
            if (!company) throw new Error('Company not found');

            const documentIds = (company.documentIds || []).filter((id) => id !== documentId);
            const updated = { documentIds, updatedAt: new Date() };
            await db.companies.update(companyId, updated);

            set((state) => ({
              companies: state.companies.map((c) =>
                c.id === companyId ? { ...c, ...updated } : c
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to unlink document',
              isLoading: false,
            });
            throw error;
          }
        },

        linkInterview: async (companyId, interviewId) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(companyId);
            if (!company) throw new Error('Company not found');

            const interviewIds = [...(company.interviewIds || [])];
            if (!interviewIds.includes(interviewId)) {
              interviewIds.push(interviewId);
              const updated = { interviewIds, updatedAt: new Date() };
              await db.companies.update(companyId, updated);

              set((state) => ({
                companies: state.companies.map((c) =>
                  c.id === companyId ? { ...c, ...updated } : c
                ),
                isLoading: false,
              }));
            } else {
              set({ isLoading: false });
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to link interview',
              isLoading: false,
            });
            throw error;
          }
        },

        unlinkInterview: async (companyId, interviewId) => {
          set({ isLoading: true, error: null });
          try {
            const company = await db.companies.get(companyId);
            if (!company) throw new Error('Company not found');

            const interviewIds = (company.interviewIds || []).filter((id) => id !== interviewId);
            const updated = { interviewIds, updatedAt: new Date() };
            await db.companies.update(companyId, updated);

            set((state) => ({
              companies: state.companies.map((c) =>
                c.id === companyId ? { ...c, ...updated } : c
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to unlink interview',
              isLoading: false,
            });
            throw error;
          }
        },

        bulkDelete: async (ids) => {
          set({ isLoading: true, error: null });
          try {
            await db.companies.bulkDelete(ids);
            set((state) => ({
              companies: state.companies.filter((c) => !ids.includes(c.id)),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete companies',
              isLoading: false,
            });
            throw error;
          }
        },

        bulkUpdateStatus: async (ids, status) => {
          set({ isLoading: true, error: null });
          try {
            const updates = ids.map((id) => ({
              key: id,
              changes: { status, updatedAt: new Date() },
            }));
            await db.companies.bulkUpdate(updates);

            set((state) => ({
              companies: state.companies.map((c) =>
                ids.includes(c.id) ? { ...c, status, updatedAt: new Date() } : c
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update status',
              isLoading: false,
            });
            throw error;
          }
        },

        bulkUpdatePriority: async (ids, priority) => {
          set({ isLoading: true, error: null });
          try {
            const updates = ids.map((id) => ({
              key: id,
              changes: { priority, updatedAt: new Date() },
            }));
            await db.companies.bulkUpdate(updates);

            set((state) => ({
              companies: state.companies.map((c) =>
                ids.includes(c.id) ? { ...c, priority, updatedAt: new Date() } : c
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update priority',
              isLoading: false,
            });
            throw error;
          }
        },

        bulkToggleResearched: async (ids, researched) => {
          set({ isLoading: true, error: null });
          try {
            const updates = ids.map((id) => ({
              key: id,
              changes: { researched, updatedAt: new Date() },
            }));
            await db.companies.bulkUpdate(updates);

            set((state) => ({
              companies: state.companies.map((c) =>
                ids.includes(c.id) ? { ...c, researched, updatedAt: new Date() } : c
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update researched status',
              isLoading: false,
            });
            throw error;
          }
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

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { Document } from '@/types';

interface DocumentsState {
  documents: Document[];
  selectedDocumentId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDocuments: () => Promise<void>;
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  updateVersionName: (id: string, versionName: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  linkDocumentToApplications: (documentId: string, applicationIds: string[]) => Promise<void>;
  unlinkDocumentFromApplication: (documentId: string, applicationId: string) => Promise<void>;
  getDocumentsByApplication: (applicationId: string) => Document[];
  getDocumentsByType: (type: Document['type']) => Document[];
  setSelectedDocument: (id: string | null) => void;
  clearError: () => void;
}

export const useDocumentsStore = create<DocumentsState>()(
  devtools(
    (set, get) => ({
      documents: [],
      selectedDocumentId: null,
      isLoading: false,
      error: null,

      fetchDocuments: async () => {
        set({ isLoading: true, error: null });
        try {
          const documents = await db.documents.toArray();
          set({ documents, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch documents',
            isLoading: false,
          });
        }
      },

      addDocument: async (document) => {
        set({ isLoading: true, error: null });
        try {
          const newDocument: Document = {
            ...document,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await db.documents.add(newDocument);
          set((state) => ({
            documents: [...state.documents, newDocument],
            isLoading: false,
          }));
          
          return newDocument;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add document',
            isLoading: false,
          });
          throw error;
        }
      },

      updateDocument: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const document = get().documents.find((doc) => doc.id === id);
          if (!document) {
            throw new Error('Document not found');
          }

          // Increment version if content is being updated
          const shouldIncrementVersion = updates.content && updates.content !== document.content;
          
          const updatedData = {
            ...updates,
            ...(shouldIncrementVersion ? { version: document.version + 1 } : {}),
            updatedAt: new Date(),
          };

          await db.documents.update(id, updatedData);
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === id ? { ...doc, ...updatedData } : doc
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update document',
            isLoading: false,
          });
          throw error;
        }
      },

      updateVersionName: async (id, versionName) => {
        set({ isLoading: true, error: null });
        try {
          const document = get().documents.find((doc) => doc.id === id);
          if (!document) {
            throw new Error('Document not found');
          }

          const updatedData = {
            versionName,
            updatedAt: new Date(),
          };

          await db.documents.update(id, updatedData);
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === id ? { ...doc, ...updatedData } : doc
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update version name',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteDocument: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await db.documents.delete(id);
          set((state) => ({
            documents: state.documents.filter((doc) => doc.id !== id),
            selectedDocumentId: state.selectedDocumentId === id ? null : state.selectedDocumentId,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete document',
            isLoading: false,
          });
          throw error;
        }
      },

      getDocumentsByApplication: (applicationId) => {
        return get().documents.filter((doc) => doc.applicationId === applicationId);
      },

      getDocumentsByType: (type) => {
        return get().documents.filter((doc) => doc.type === type);
      },

      linkDocumentToApplications: async (documentId, applicationIds) => {
        set({ isLoading: true, error: null });
        try {
          const document = get().documents.find((doc) => doc.id === documentId);
          if (!document) {
            throw new Error('Document not found');
          }

          // Merge new application IDs with existing ones (no duplicates)
          const existingAppIds = document.usedInApplicationIds || [];
          const mergedAppIds = Array.from(new Set([...existingAppIds, ...applicationIds]));

          const updates = {
            usedInApplicationIds: mergedAppIds,
            lastUsedDate: new Date(),
            updatedAt: new Date(),
          };

          await db.documents.update(documentId, updates);
          
          // Update applications with version-tracked links
          const { useApplicationsStore } = await import('./applicationsStore');
          const applicationsStore = useApplicationsStore.getState();
          
          for (const appId of applicationIds) {
            const app = applicationsStore.applications.find((a) => a.id === appId);
            if (app) {
              const existingLinks = app.linkedDocuments || [];
              const alreadyLinked = existingLinks.some((link) => link.documentId === documentId);
              
              if (!alreadyLinked) {
                const newLink = {
                  documentId: document.id,
                  documentName: document.name,
                  documentType: document.type,
                  version: document.version,
                  versionName: document.versionName,
                  linkedAt: new Date(),
                };
                
                // Use the store's updateApplication method to trigger reactivity
                await applicationsStore.updateApplication(appId, {
                  linkedDocuments: [...existingLinks, newLink],
                  // Keep documentIds for backward compatibility
                  documentIds: Array.from(new Set([...(app.documentIds || []), documentId])),
                });
              }
            }
          }
          
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === documentId ? { ...doc, ...updates } : doc
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to link document',
            isLoading: false,
          });
          throw error;
        }
      },

      unlinkDocumentFromApplication: async (documentId, applicationId) => {
        set({ isLoading: true, error: null });
        try {
          const document = get().documents.find((doc) => doc.id === documentId);
          if (!document) {
            throw new Error('Document not found');
          }

          const usedInApplicationIds = (document.usedInApplicationIds || []).filter(
            (id) => id !== applicationId
          );

          const updates = {
            usedInApplicationIds,
            updatedAt: new Date(),
          };

          await db.documents.update(documentId, updates);
          
          // Remove from application's linkedDocuments
          const { useApplicationsStore } = await import('./applicationsStore');
          const applicationsStore = useApplicationsStore.getState();
          const app = applicationsStore.applications.find((a) => a.id === applicationId);
          if (app) {
            const updatedLinks = (app.linkedDocuments || []).filter(
              (link) => link.documentId !== documentId
            );
            const updatedDocIds = (app.documentIds || []).filter((id) => id !== documentId);
            
            // Use the store's updateApplication method to trigger reactivity
            await applicationsStore.updateApplication(applicationId, {
              linkedDocuments: updatedLinks,
              documentIds: updatedDocIds,
            });
          }
          
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === documentId ? { ...doc, ...updates } : doc
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

      setSelectedDocument: (id) => {
        set({ selectedDocumentId: id });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'DocumentsStore' }
  )
);

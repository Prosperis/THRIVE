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
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
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
          const updatedData = {
            ...updates,
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

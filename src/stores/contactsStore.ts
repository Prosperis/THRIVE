import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Contact } from '@/types';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

interface ContactsState {
  contacts: Contact[];
  selectedContactId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  setSelectedContact: (id: string | null) => void;
  clearError: () => void;
}

export const useContactsStore = create<ContactsState>()(
  devtools(
    persist(
      (set) => ({
        contacts: [],
        selectedContactId: null,
        isLoading: false,
        error: null,

        fetchContacts: async () => {
          set({ isLoading: true, error: null });
          try {
            const contacts = await db.contacts.toArray();
            set({ contacts, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch contacts',
              isLoading: false,
            });
          }
        },

        addContact: async (contactData) => {
          set({ isLoading: true, error: null });
          try {
            const now = new Date();
            const contact: Contact = {
              ...contactData,
              id: generateId(),
              createdAt: now,
              updatedAt: now,
            };

            await db.contacts.add(contact);
            set((state) => ({
              contacts: [...state.contacts, contact],
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to add contact',
              isLoading: false,
            });
            throw error;
          }
        },

        updateContact: async (id, updates) => {
          set({ isLoading: true, error: null });
          try {
            const updatedContact = {
              ...updates,
              updatedAt: new Date(),
            };

            await db.contacts.update(id, updatedContact);
            set((state) => ({
              contacts: state.contacts.map((contact) =>
                contact.id === id ? { ...contact, ...updatedContact } : contact
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update contact',
              isLoading: false,
            });
            throw error;
          }
        },

        deleteContact: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await db.contacts.delete(id);
            set((state) => ({
              contacts: state.contacts.filter((contact) => contact.id !== id),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete contact',
              isLoading: false,
            });
            throw error;
          }
        },

        setSelectedContact: (id) => {
          set({ selectedContactId: id });
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'contacts-storage',
        partialize: (state) => ({
          contacts: state.contacts,
          selectedContactId: state.selectedContactId,
        }),
      }
    ),
    { name: 'ContactsStore' }
  )
);

import { gql } from '@apollo/client';
import { create } from 'zustand';
import { graphqlClient } from '../lib/graphql';
import type { Contact } from '../types';

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Contact>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  getContactById: (id: string) => Contact | undefined;
  getContactsByCompany: (companyId: string) => Contact[];
}

const GET_CONTACTS = gql`
  query GetContacts {
    contacts {
      id
      name
      companyId
      companyName
      title
      email
      phone
      linkedin
      notes
      relationship
      createdAt
      updatedAt
    }
  }
`;

const CREATE_CONTACT = gql`
  mutation CreateContact($input: ContactInput!) {
    createContact(input: $input) {
      id
      name
      companyId
      companyName
      title
      email
      phone
      linkedin
      notes
      relationship
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $input: ContactInput!) {
    updateContact(id: $id, input: $input) {
      id
      name
      companyId
      companyName
      title
      email
      phone
      linkedin
      notes
      relationship
      createdAt
      updatedAt
    }
  }
`;

const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
  }
`;

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  loading: false,
  error: null,

  fetchContacts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await graphqlClient.query({
        query: GET_CONTACTS,
        fetchPolicy: 'network-only',
      });

      set({ contacts: (data as any).contacts, loading: false });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      set({ error: 'Failed to fetch contacts', loading: false });
    }
  },

  addContact: async (contact) => {
    set({ loading: true, error: null });
    try {
      const { data } = await graphqlClient.mutate({
        mutation: CREATE_CONTACT,
        variables: { input: contact },
      });

      const newContact = (data as any).createContact;
      set((state) => ({
        contacts: [...state.contacts, newContact],
        loading: false,
      }));

      return newContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      set({ error: 'Failed to create contact', loading: false });
      throw error;
    }
  },

  updateContact: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data } = await graphqlClient.mutate({
        mutation: UPDATE_CONTACT,
        variables: { id, input: updates },
      });

      const updatedContact = (data as any).updateContact;
      set((state) => ({
        contacts: state.contacts.map((contact) => (contact.id === id ? updatedContact : contact)),
        loading: false,
      }));

      return updatedContact;
    } catch (error) {
      console.error('Error updating contact:', error);
      set({ error: 'Failed to update contact', loading: false });
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ loading: true, error: null });
    try {
      await graphqlClient.mutate({
        mutation: DELETE_CONTACT,
        variables: { id },
      });

      set((state) => ({
        contacts: state.contacts.filter((contact) => contact.id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error('Error deleting contact:', error);
      set({ error: 'Failed to delete contact', loading: false });
      throw error;
    }
  },

  getContactById: (id) => {
    return get().contacts.find((contact) => contact.id === id);
  },

  getContactsByCompany: (companyId) => {
    return get().contacts.filter((contact) => contact.companyId === companyId);
  },
}));

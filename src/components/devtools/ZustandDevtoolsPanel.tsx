import type { JSX } from 'react';
import { useState } from 'react';
import { useActivityStore } from '@/stores/activityStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { useBackupStore } from '@/stores/backupStore';
import { useCompaniesStore } from '@/stores/companiesStore';
import { useContactsStore } from '@/stores/contactsStore';
import { useDocumentsStore } from '@/stores/documentsStore';
import { useInterviewPrepStore } from '@/stores/interviewPrepStore';
import { useInterviewsStore } from '@/stores/interviewsStore';
import { useNoteStore } from '@/stores/noteStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { useSearchStore } from '@/stores/searchStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTagStore } from '@/stores/tagStore';
import { useTemplateStore } from '@/stores/templateStore';
import { useUIStore } from '@/stores/uiStore';

const stores = [
  { name: 'Applications', hook: useApplicationsStore },
  { name: 'Interviews', hook: useInterviewsStore },
  { name: 'Companies', hook: useCompaniesStore },
  { name: 'Contacts', hook: useContactsStore },
  { name: 'UI', hook: useUIStore },
  { name: 'Settings', hook: useSettingsStore },
  { name: 'Notifications', hook: useNotificationsStore },
  { name: 'Search', hook: useSearchStore },
  { name: 'Templates', hook: useTemplateStore },
  { name: 'Tags', hook: useTagStore },
  { name: 'Notes', hook: useNoteStore },
  { name: 'Activity', hook: useActivityStore },
  { name: 'Backup', hook: useBackupStore },
  { name: 'Interview Prep', hook: useInterviewPrepStore },
  { name: 'Documents', hook: useDocumentsStore },
] as const;

type StoreName = (typeof stores)[number]['name'];

export function ZustandDevtoolsPanel() {
  const [selectedStore, setSelectedStore] = useState<StoreName>('Applications');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // Get all store states
  const storeStates = stores.map((store) => ({
    name: store.name,
    state: store.hook.getState(),
  }));

  const selectedState = storeStates.find((s) => s.name === selectedStore)?.state;

  const toggleKey = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderValue = (value: unknown, path = ''): JSX.Element => {
    if (value === null) {
      return <span style={{ color: '#6b7280' }}>null</span>;
    }
    if (value === undefined) {
      return <span style={{ color: '#6b7280' }}>undefined</span>;
    }
    if (typeof value === 'string') {
      return <span style={{ color: '#10b981' }}>"{value}"</span>;
    }
    if (typeof value === 'number') {
      return <span style={{ color: '#3b82f6' }}>{value}</span>;
    }
    if (typeof value === 'boolean') {
      return <span style={{ color: '#f59e0b' }}>{String(value)}</span>;
    }
    if (typeof value === 'function') {
      return <span style={{ color: '#8b5cf6' }}>[Function]</span>;
    }
    if (Array.isArray(value)) {
      const isExpanded = expandedKeys.has(path);
      return (
        <div>
          <button
            type="button"
            onClick={() => toggleKey(path)}
            style={{
              background: 'none',
              border: 'none',
              color: '#d0d5dd',
              cursor: 'pointer',
              padding: 0,
              marginRight: '0.5rem',
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span style={{ color: '#6b7280' }}>Array({value.length})</span>
          {isExpanded && (
            <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
              {value.map((item, index) => (
                <div key={index} style={{ marginBottom: '0.25rem' }}>
                  <span style={{ color: '#6b7280' }}>{index}: </span>
                  {renderValue(item, `${path}.${index}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    if (typeof value === 'object') {
      const isExpanded = expandedKeys.has(path);
      const entries = Object.entries(value);
      return (
        <div>
          <button
            type="button"
            onClick={() => toggleKey(path)}
            style={{
              background: 'none',
              border: 'none',
              color: '#d0d5dd',
              cursor: 'pointer',
              padding: 0,
              marginRight: '0.5rem',
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span style={{ color: '#6b7280' }}>Object({entries.length})</span>
          {isExpanded && (
            <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
              {entries.map(([key, val]) => (
                <div key={key} style={{ marginBottom: '0.25rem' }}>
                  <span style={{ color: '#ec4899' }}>{key}: </span>
                  {renderValue(val, `${path}.${key}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return <span>{String(value)}</span>;
  };

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'monospace', fontSize: '13px' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '200px',
          borderRight: '1px solid #374151',
          overflowY: 'auto',
          backgroundColor: '#111318',
        }}
      >
        {stores.map((store) => {
          const state = storeStates.find((s) => s.name === store.name)?.state;
          const stateSize = state ? Object.keys(state).length : 0;

          return (
            <button
              key={store.name}
              type="button"
              onClick={() => setSelectedStore(store.name)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem',
                background: selectedStore === store.name ? '#1f2937' : 'transparent',
                border: 'none',
                color: selectedStore === store.name ? '#fff' : '#d0d5dd',
                cursor: 'pointer',
                borderBottom: '1px solid #374151',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div style={{ fontWeight: 500 }}>{store.name}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                {stateSize} {stateSize === 1 ? 'key' : 'keys'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>
            {selectedStore} Store
          </h3>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            Current state of the {selectedStore} Zustand store
          </p>
        </div>

        {selectedState && (
          <div style={{ backgroundColor: '#1f2937', padding: '1rem', borderRadius: '0.5rem' }}>
            {Object.entries(selectedState).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '0.75rem' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{ color: '#ec4899', fontWeight: 500 }}>{key}: </span>
                </div>
                <div style={{ marginLeft: '1rem' }}>{renderValue(value, key)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/db';

type TableName = 'applications' | 'interviews' | 'documents' | 'companies' | 'contacts';

interface TableStats {
  name: TableName;
  count: number;
}

export function DexieDevtoolsPanel() {
  const [selectedTable, setSelectedTable] = useState<TableName>('applications');
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [tableData, setTableData] = useState<unknown[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const tables: TableName[] = ['applications', 'interviews', 'documents', 'companies', 'contacts'];

  // Load table stats
  useEffect(() => {
    const loadStats = async () => {
      const stats = await Promise.all(
        tables.map(async (tableName) => ({
          name: tableName,
          count: await db[tableName].count(),
        }))
      );
      setTableStats(stats);
    };
    loadStats();
  }, []);

  // Load selected table data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await db[selectedTable].toArray();
        setTableData(data);
      } catch (error) {
        console.error('Error loading table data:', error);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedTable]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const renderValue = (value: unknown): JSX.Element => {
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
    if (value instanceof Date) {
      return <span style={{ color: '#8b5cf6' }}>{value.toISOString()}</span>;
    }
    if (typeof value === 'object') {
      return <span style={{ color: '#6b7280' }}>[Object]</span>;
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
        <div
          style={{
            padding: '0.75rem',
            borderBottom: '1px solid #374151',
            backgroundColor: '#1f2937',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>ThriveDB Tables</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '0.25rem' }}>
            IndexedDB via Dexie
          </div>
        </div>

        {tables.map((tableName) => {
          const stats = tableStats.find((s) => s.name === tableName);
          const count = stats?.count ?? 0;

          return (
            <button
              key={tableName}
              type="button"
              onClick={() => setSelectedTable(tableName)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem',
                background: selectedTable === tableName ? '#1f2937' : 'transparent',
                border: 'none',
                color: selectedTable === tableName ? '#fff' : '#d0d5dd',
                cursor: 'pointer',
                borderBottom: '1px solid #374151',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{tableName}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                {count} {count === 1 ? 'record' : 'records'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            padding: '1rem',
            borderBottom: '1px solid #374151',
            backgroundColor: '#1f2937',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>
            {selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}
          </h3>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            {tableData.length} {tableData.length === 1 ? 'record' : 'records'} in IndexedDB
          </p>
        </div>

        <div style={{ padding: '1rem' }}>
          {loading ? (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              Loading...
            </div>
          ) : tableData.length === 0 ? (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No records found
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tableData.map((record, index) => {
                const isExpanded = expandedRows.has(index);
                const recordObj = record as Record<string, unknown>;
                const previewKeys = ['id', 'name', 'position', 'title', 'email', 'type', 'status'];
                const previewEntries = Object.entries(recordObj).filter(([key]) =>
                  previewKeys.includes(key)
                );

                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#1f2937',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleRow(index)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {previewEntries.map(([key, value]) => (
                          <span key={key}>
                            <span style={{ color: '#ec4899' }}>{key}: </span>
                            {renderValue(value)}
                          </span>
                        ))}
                      </div>
                      <span style={{ color: '#6b7280' }}>{isExpanded ? '▼' : '▶'}</span>
                    </button>

                    {isExpanded && (
                      <div
                        style={{
                          padding: '0.75rem',
                          borderTop: '1px solid #374151',
                          backgroundColor: '#111318',
                        }}
                      >
                        <pre
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color: '#d0d5dd',
                            overflowX: 'auto',
                          }}
                        >
                          {JSON.stringify(record, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

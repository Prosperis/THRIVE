import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import type { Table } from '@tanstack/react-table';
import { CompaniesToolbar } from '@/components/features/companies/CompaniesToolbar';
import { CompaniesTable } from '@/components/features/companies/CompaniesTable';
import { CompanyResearchHub } from '@/components/interview-prep/CompanyResearchHub';
import { useCompaniesStore } from '@/stores/companiesStore';
import type { Company } from '@/types';

export const Route = createFileRoute('/companies')({
  component: CompaniesRoute,
});

type ViewType = 'cards' | 'table' | 'list';

function CompaniesRoute() {
  const { companies } = useCompaniesStore();
  const [activeView, setActiveView] = useState<ViewType>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    status?: string[];
    remotePolicy?: string[];
    researched?: boolean;
  }>({});
  const [table, setTable] = useState<Table<Company> | undefined>();

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status?.length) count += filters.status.length;
    if (filters.remotePolicy?.length) count += filters.remotePolicy.length;
    if (filters.researched !== undefined) count += 1;
    return count;
  }, [filters]);

  // Filter and search companies
  const filteredCompanies = useMemo(() => {
    let result = companies;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.industry?.some((ind) => ind.toLowerCase().includes(query)) ||
          company.location?.toLowerCase().includes(query) ||
          company.notes?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status?.length) {
      result = result.filter((company) => 
        company.status && filters.status?.includes(company.status)
      );
    }

    // Apply remote policy filter
    if (filters.remotePolicy?.length) {
      result = result.filter((company) =>
        company.remotePolicy && filters.remotePolicy?.includes(company.remotePolicy)
      );
    }

    // Apply researched filter
    if (filters.researched !== undefined) {
      result = result.filter((company) => company.researched === filters.researched);
    }

    return result;
  }, [companies, searchQuery, filters]);

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleAddCompany = () => {
    // TODO: Open add company dialog
    console.log('Add company clicked');
  };

  return (
    <div className="space-y-6">
      <CompaniesToolbar
        table={table}
        activeView={activeView}
        onViewChange={setActiveView}
        onAddCompany={handleAddCompany}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        activeFilterCount={activeFilterCount}
        onClearFilters={handleClearFilters}
      />

      {activeView === 'table' && (
        <CompaniesTable
          companies={filteredCompanies}
          onTableReady={setTable}
        />
      )}

      {activeView === 'cards' && (
        <CompanyResearchHub />
      )}

      {activeView === 'list' && (
        <div className="text-center py-12 text-muted-foreground">
          List view coming soon...
        </div>
      )}
    </div>
  );
}

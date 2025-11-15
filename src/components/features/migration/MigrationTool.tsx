import { AlertCircle, CheckCircle, Database, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { db } from '@/lib/db';
import { runMigration } from '@/lib/migration';

interface MigrationStatus {
  total: number;
  completed: number;
  currentTable: string;
  error: string | null;
  success: boolean;
}

export function MigrationTool() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [status, setStatus] = useState<MigrationStatus>({
    total: 0,
    completed: 0,
    currentTable: '',
    error: null,
    success: false,
  });

  const getLocalDataCounts = async () => {
    const counts = {
      applications: await db.applications.count(),
      interviews: await db.interviews.count(),
      companies: await db.companies.count(),
      contacts: await db.contacts.count(),
      documents: await db.documents.count(),
    };
    return counts;
  };

  const startMigration = async () => {
    setIsMigrating(true);
    setStatus({
      total: 0,
      completed: 0,
      currentTable: '',
      error: null,
      success: false,
    });

    try {
      // Get counts for progress tracking
      const counts = await getLocalDataCounts();
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

      setStatus((prev) => ({ ...prev, total }));

      // Run the migration
      await runMigration('test-user-id');

      setStatus((prev) => ({
        ...prev,
        completed: total,
        success: true,
        currentTable: 'Migration completed!',
      }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Migration failed',
        success: false,
      }));
    } finally {
      setIsMigrating(false);
    }
  };

  const [localCounts, setLocalCounts] = useState<Record<string, number>>({});

  // Load local counts on mount
  useState(() => {
    getLocalDataCounts().then(setLocalCounts);
  });

  const totalLocal = Object.values(localCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Migration Tool
        </CardTitle>
        <CardDescription>
          Migrate your local data from Dexie (IndexedDB) to Supabase cloud database
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Local Data Overview */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Local Data (Dexie)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm">Applications:</span>
              <span className="text-sm font-medium">{localCounts.applications || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Interviews:</span>
              <span className="text-sm font-medium">{localCounts.interviews || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Companies:</span>
              <span className="text-sm font-medium">{localCounts.companies || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Contacts:</span>
              <span className="text-sm font-medium">{localCounts.contacts || 0}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-sm">Documents:</span>
              <span className="text-sm font-medium">{localCounts.documents || 0}</span>
            </div>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-medium">Total Records:</span>
            <span className="text-sm font-bold">{totalLocal}</span>
          </div>
        </div>

        {/* Migration Progress */}
        {isMigrating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress:</span>
              <span>
                {status.completed} / {status.total}
              </span>
            </div>
            <Progress value={(status.completed / status.total) * 100} />
            {status.currentTable && (
              <p className="text-xs text-muted-foreground">Migrating: {status.currentTable}</p>
            )}
          </div>
        )}

        {/* Status Messages */}
        {status.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        {status.success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Migration completed successfully! Your data has been transferred to Supabase.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        <Button
          onClick={startMigration}
          disabled={isMigrating || totalLocal === 0}
          className="w-full"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Start Migration to Supabase
            </>
          )}
        </Button>

        {totalLocal === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            No local data found. Make sure you have data in your local database before migrating.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

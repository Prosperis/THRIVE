// =============================================================================
// PHASE 1.7: MIGRATION TESTING SCRIPT
// =============================================================================
// Copy and paste this into your browser console (F12 → Console tab)
// while on http://localhost:5173/companies
// =============================================================================

console.log('🧪 Starting Phase 1.7 Migration Tests...\n');

// Test 1: Check Migration Status
// =============================================================================
console.group('📋 Test 1: Migration Status');
const migrationFlag = localStorage.getItem('thrive_companies_migration_completed');
console.log('Migration completed flag:', migrationFlag === 'true' ? '✅ Yes' : '❌ No');

if (migrationFlag === 'true') {
  console.log('✅ Migration has been completed');
} else {
  console.log('⚠️ Migration has NOT been completed yet');
  console.log('👉 Refresh the page to trigger auto-migration');
}
console.groupEnd();

// Test 2: Check localStorage Data
// =============================================================================
console.group('📋 Test 2: localStorage Data');

// Check old store
const oldStore = localStorage.getItem('interview-prep-storage');
if (oldStore) {
  try {
    const parsed = JSON.parse(oldStore);
    const oldCount = parsed.state?.companyNotes?.length || 0;
    console.log('📦 Old interviewPrepStore companyNotes:', oldCount);
  } catch (e) {
    console.log('❌ Error parsing old store:', e);
  }
} else {
  console.log('📦 Old interviewPrepStore: Not found (expected after migration)');
}

// Check new store
const newStore = localStorage.getItem('companies-storage');
if (newStore) {
  try {
    const parsed = JSON.parse(newStore);
    const newCount = parsed.state?.companies?.length || 0;
    console.log('📦 New companiesStore companies:', newCount);
    console.log('✅ Companies store exists');
  } catch (e) {
    console.log('❌ Error parsing new store:', e);
  }
} else {
  console.log('⚠️ New companiesStore: Not found');
}
console.groupEnd();

// Test 3: Check IndexedDB
// =============================================================================
console.group('📋 Test 3: IndexedDB Data');
const dbRequest = indexedDB.open('thrive_db');

dbRequest.onsuccess = (event) => {
  const db = event.target.result;
  
  if (!db.objectStoreNames.contains('companies')) {
    console.log('❌ Companies object store not found in IndexedDB');
    console.groupEnd();
    return;
  }
  
  const transaction = db.transaction(['companies'], 'readonly');
  const store = transaction.objectStore('companies');
  const countRequest = store.count();
  
  countRequest.onsuccess = () => {
    console.log('🗄️ Total companies in IndexedDB:', countRequest.result);
    
    if (countRequest.result > 0) {
      // Get first few companies as sample
      const getAllRequest = store.getAll(5);
      getAllRequest.onsuccess = () => {
        console.log('📄 Sample companies (first 5):');
        getAllRequest.result.forEach((company, i) => {
          console.log(`  ${i + 1}. ${company.name} (ID: ${company.id})`);
          console.log(`     - Industry: ${company.industry?.join(', ') || 'N/A'}`);
          console.log(`     - Status: ${company.status || 'N/A'}`);
          console.log(`     - Researched: ${company.researched ? '✓' : '✗'}`);
        });
        console.log('✅ IndexedDB check complete');
        console.groupEnd();
      };
    } else {
      console.log('⚠️ No companies found in IndexedDB');
      console.groupEnd();
    }
  };
  
  countRequest.onerror = () => {
    console.log('❌ Error counting companies:', countRequest.error);
    console.groupEnd();
  };
};

dbRequest.onerror = () => {
  console.log('❌ Error opening IndexedDB:', dbRequest.error);
  console.groupEnd();
};

// Test 4: Migration Status Helper
// =============================================================================
setTimeout(() => {
  console.log('\n' + '='.repeat(80));
  console.log('🎯 MIGRATION TEST SUMMARY');
  console.log('='.repeat(80));
  
  const hasFlag = localStorage.getItem('thrive_companies_migration_completed') === 'true';
  const hasNewStore = localStorage.getItem('companies-storage') !== null;
  
  if (hasFlag && hasNewStore) {
    console.log('✅ Migration appears successful!');
    console.log('\n📝 Next steps:');
    console.log('1. Test creating a new company');
    console.log('2. Test editing an existing company');
    console.log('3. Test deleting a company');
    console.log('4. Test search and filters');
    console.log('5. Test application linking');
    console.log('\nSee PHASE_1_TESTING.md for full checklist');
  } else if (!hasFlag) {
    console.log('⚠️ Migration not completed yet');
    console.log('\n👉 Refresh the page to trigger migration');
  } else {
    console.log('⚠️ Partial migration state detected');
    console.log('\n👉 Check browser console for migration errors');
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('💡 Useful commands:');
  console.log('='.repeat(80));
  console.log('// Check migration status:');
  console.log('getMigrationStatus()');
  console.log('\n// Force re-run migration (caution: may duplicate):');
  console.log('resetMigration(); location.reload();');
  console.log('\n// Clear all companies (for testing):');
  console.log('localStorage.removeItem("companies-storage"); location.reload();');
}, 1000);

console.log('\n⏳ Running tests...\n');

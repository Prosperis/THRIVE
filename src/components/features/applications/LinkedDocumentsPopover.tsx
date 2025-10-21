import { Eye, X, Download, Search, Filter, ArrowUpDown, GitCompare, ChevronDown } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { Document, DocumentVersionLink } from '@/types';
import { useDocumentsStore } from '@/stores';
import { getDocumentTypeIcon, getDocumentTypeColors } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VersionComparisonDialog } from '@/components/features/documents/VersionComparisonDialog';

interface LinkedDocumentsPopoverProps {
  documents: Document[];
  linkedDocuments?: DocumentVersionLink[]; // Phase 5: Version tracking
  applicationId: string;
  children: React.ReactNode;
  onUnlink?: () => void;
}

export function LinkedDocumentsPopover({ 
  documents, 
  linkedDocuments,
  applicationId,
  children,
  onUnlink,
}: LinkedDocumentsPopoverProps) {
  const navigate = useNavigate();
  const { unlinkDocumentFromApplication } = useDocumentsStore();
  const [isUnlinking, setIsUnlinking] = useState<string | null>(null);
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);
  
  // Phase 4: Filtering & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'version' | 'type'>('name');
  
  // Phase 5: Version comparison
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [comparingDocument, setComparingDocument] = useState<Document | null>(null);

  // Phase 5: Get version info for each document
  const getLinkedVersion = (documentId: string) => {
    return linkedDocuments?.find(link => link.documentId === documentId);
  };

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date': {
          const dateA = a.lastUsedDate ? new Date(a.lastUsedDate).getTime() : 0;
          const dateB = b.lastUsedDate ? new Date(b.lastUsedDate).getTime() : 0;
          return dateB - dateA; // Most recent first
        }
        case 'version':
          return b.version - a.version; // Highest version first
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return sorted;
  }, [documents, searchQuery, typeFilter, sortBy]);

  if (documents.length === 0) {
    return <>{children}</>;
  }

  const handleCompareVersions = (doc: Document) => {
    setComparingDocument(doc);
    setComparisonOpen(true);
  };

  const handleViewDocument = (documentId: string) => {
    // Navigate to documents page with the document selected
    navigate({ to: '/documents', search: { docId: documentId } });
  };

  const handleUnlinkDocument = async (documentId: string, documentName: string) => {
    setIsUnlinking(documentId);
    try {
      await unlinkDocumentFromApplication(documentId, applicationId);
      toast.success('Document Unlinked', {
        description: `${documentName} removed from this application`,
      });
      onUnlink?.(); // Callback to refresh parent component
    } catch (error) {
      toast.error('Failed to Unlink', {
        description: 'Unable to remove document. Please try again.',
      });
      console.error('Error unlinking document:', error);
    } finally {
      setIsUnlinking(null);
    }
  };

  const handleDownloadDocument = (doc: Document) => {
    const content = doc.content || '';
    let fileName = doc.name;
    let mimeType = 'text/plain';
    
    // Determine file type and extension
    if (doc.fileName) {
      fileName = doc.fileName;
    } else if (doc.type === 'resume' || doc.type === 'cv') {
      fileName = `${fileName}.pdf`;
      mimeType = 'application/pdf';
    } else if (doc.type === 'cover-letter') {
      fileName = `${fileName}.md`;
      mimeType = 'text/markdown';
    } else {
      fileName = `${fileName}.txt`;
    }
    
    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Downloaded', {
      description: `${doc.name} downloaded successfully`,
    });
  };

  const togglePreview = (documentId: string) => {
    setExpandedPreview(prev => prev === documentId ? null : documentId);
  };

  const getPreviewContent = (content: string | undefined) => {
    if (!content) return 'No content available';
    const lines = content.split('\n').slice(0, 5);
    return lines.join('\n');
  };

  const getDocumentTypeName = (type: Document['type']) => {
    switch (type) {
      case 'resume':
        return 'Resume';
      case 'cv':
        return 'CV';
      case 'cover-letter':
        return 'Cover Letter';
      case 'portfolio':
        return 'Portfolio';
      case 'transcript':
        return 'Transcript';
      case 'certification':
        return 'Certification';
      default:
        return 'Document';
    }
  };

  return (
    <>
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 animate-fadeIn" 
        align="end" 
        sideOffset={5}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b space-y-2 animate-slideDown">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Linked Documents</h4>
            <Badge variant="secondary" className="text-xs">
              {filteredAndSortedDocuments.length}/{documents.length}
            </Badge>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-2 text-xs"
            />
          </div>
          
          {/* Filters and Sort */}
          <div className="flex items-center gap-2">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="resume">Resume</SelectItem>
                <SelectItem value="cv">CV</SelectItem>
                <SelectItem value="cover-letter">Cover Letter</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort By */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'date' | 'version' | 'type')}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Recent</SelectItem>
                <SelectItem value="version">Version</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[min(280px,calc(100vh-420px))] overflow-y-auto scrollbar-hide">
            {filteredAndSortedDocuments.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No documents match your filters
              </div>
          ) : (
            <div className="p-2 space-y-2">
              {filteredAndSortedDocuments.map((doc, index) => {
                const colors = getDocumentTypeColors(doc.type);
                return (
                <div key={doc.id} className="space-y-1 animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  {index > 0 && <Separator className="my-2" />}
                  <div className={`p-2 rounded-md border transition-all duration-200 hover:shadow-sm hover:scale-[1.01] ${colors.bg} ${colors.border}`}>
                    {/* Document Header */}
                    <div className="flex items-start gap-2">
                      <span className="text-lg shrink-0 mt-0.5">
                        {getDocumentTypeIcon(doc.type)}
                      </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewDocument(doc.id)}
                          className="text-sm font-medium truncate hover:underline text-left"
                        >
                          {doc.name}
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          {(() => {
                            const linkedVersion = getLinkedVersion(doc.id);
                            const isOutdated = linkedVersion && linkedVersion.version < doc.version;
                            
                            return isOutdated && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompareVersions(doc);
                                }}
                                title="Compare versions"
                              >
                                <GitCompare className="h-3 w-3" />
                              </Button>
                            );
                          })()}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadDocument(doc);
                            }}
                            title="Download"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlinkDocument(doc.id, doc.name);
                            }}
                            disabled={isUnlinking === doc.id}
                            title="Unlink"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <Badge variant="outline" className={`text-[10px] h-4 px-1.5 shrink-0 ${colors.badge}`}>
                          {getDocumentTypeName(doc.type)}
                        </Badge>
                        
                        {(() => {
                          const linkedVersion = getLinkedVersion(doc.id);
                          const linkedDate = linkedVersion?.linkedAt;
                          const displayDate = linkedDate || doc.lastUsedDate;
                          
                          return displayDate && (
                            <span className="text-xs text-muted-foreground">
                              Linked {new Date(displayDate).toLocaleDateString()}
                            </span>
                          );
                        })()}
                        
                        {(() => {
                          const linkedVersion = getLinkedVersion(doc.id);
                          const currentVersion = doc.version;
                          const usedVersion = linkedVersion?.version || currentVersion;
                          const isOutdated = linkedVersion && usedVersion < currentVersion;
                          
                          return isOutdated && (
                            <Badge 
                              variant="outline" 
                              className="text-[10px] h-4 px-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 flex items-center gap-0.5"
                              title={`Using v${usedVersion}, current is v${currentVersion}`}
                            >
                              Outdated
                            </Badge>
                          );
                        })()}
                      </div>
                      
                      {/* Preview Toggle Button */}
                      {doc.content && (
                        <button
                          type="button"
                          onClick={() => togglePreview(doc.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1.5"
                        >
                          <Eye className="h-3 w-3" />
                          <span>{expandedPreview === doc.id ? 'Hide preview' : 'Show preview'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Content Preview */}
                  {expandedPreview === doc.id && doc.content && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="font-medium">Preview:</p>
                        <pre className="whitespace-pre-wrap bg-muted/50 p-2 rounded text-[10px] leading-relaxed max-h-[120px] overflow-y-auto">
                          {getPreviewContent(doc.content)}
                        </pre>
                        {doc.content.split('\n').length > 5 && (
                          <button
                            type="button"
                            onClick={() => handleViewDocument(doc.id)}
                            className="text-primary hover:underline text-[10px]"
                          >
                            Read more...
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
            </div>
            )}
          </div>
          
          {/* Scroll indicator - only show if there are more than 3 documents */}
          {filteredAndSortedDocuments.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-popover to-transparent pointer-events-none flex items-end justify-center pb-1">
              <ChevronDown className="h-3 w-3 text-muted-foreground animate-bounce" />
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-xs"
            onClick={() => navigate({ to: '/documents' })}
          >
            <Eye className="h-3 w-3 mr-2" />
            View All Documents
          </Button>
        </div>
      </PopoverContent>
    </Popover>
    
    {/* Version Comparison Dialog */}
    {comparingDocument && (
      <VersionComparisonDialog
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        currentDocument={comparingDocument}
        linkedVersion={getLinkedVersion(comparingDocument.id)?.version || comparingDocument.version}
        linkedContent={getLinkedVersion(comparingDocument.id)?.content}
      />
    )}
    </>
  );
}

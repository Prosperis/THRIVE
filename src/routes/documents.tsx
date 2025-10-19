import { createFileRoute } from '@tanstack/react-router';
import { FileText, Plus, Upload, Pencil, Download, Trash2, RotateCcw, Trash, FileCode, Type, FileType, File } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Document as PDFDocument, Page as PDFPage, pdfjs } from 'react-pdf';
import { jsPDF } from 'jspdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useDocumentsStore } from '@/stores';
import { useSettingsStore } from '@/stores/settingsStore';
import type { Document } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
});

function DocumentsPage() {
  const { documents, fetchDocuments, addDocument, updateDocument, deleteDocument } = useDocumentsStore();
  const { documents: documentSettings } = useSettingsStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewDocDialogOpen, setIsNewDocDialogOpen] = useState(false);
  const [isCoverLetterDialogOpen, setIsCoverLetterDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewFormat, setViewFormat] = useState<'pdf' | 'markdown' | 'richtext' | 'plain'>('markdown');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state for new document dialog
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<'resume' | 'cover-letter'>('resume');
  const [newDocContent, setNewDocContent] = useState('');

  // Form state for cover letter dialog
  const [coverLetterName, setCoverLetterName] = useState('');
  const [coverLetterCompany, setCoverLetterCompany] = useState('');
  const [coverLetterPosition, setCoverLetterPosition] = useState('');
  const [coverLetterContent, setCoverLetterContent] = useState('');

  // Editing state for view/edit dialog
  const [editingContent, setEditingContent] = useState('');
  const [editingName, setEditingName] = useState('');

  // Generate PDF from text content
  const generatedPdfUrl = useMemo(() => {
    if (!selectedDocument?.content || viewFormat !== 'pdf') return null;
    
    try {
      // Check if content is already a PDF (starts with %PDF or is base64 PDF)
      if (selectedDocument.content.startsWith('%PDF') || 
          selectedDocument.content.startsWith('JVBER') || // base64 of %PDF
          selectedDocument.mimeType === 'application/pdf') {
        return `data:application/pdf;base64,${btoa(selectedDocument.content)}`;
      }
      
      // Generate PDF from text content
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set font and size
      doc.setFontSize(11);
      doc.setFont('helvetica');
      
      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(selectedDocument.name, 20, 20);
      
      // Add content
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const content = selectedDocument.content;
      const lines = doc.splitTextToSize(content, 170); // Split text to fit page width
      
      let y = 35; // Start position
      const lineHeight = 7;
      const pageHeight = 280;
      
      for (const line of lines) {
        if (y > pageHeight) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      }
      
      // Convert to blob URL
      const pdfBlob = doc.output('blob');
      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      return null;
    }
  }, [selectedDocument, viewFormat]);

  // Cleanup PDF blob URL on unmount or when it changes
  useEffect(() => {
    return () => {
      if (generatedPdfUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(generatedPdfUrl);
      }
    };
  }, [generatedPdfUrl]);

  // Fetch documents on mount
  useEffect(() => {
    const initDocuments = async () => {
      await fetchDocuments();
      
      // Auto-delete documents older than configured days
      const autoDeleteDate = new Date();
      autoDeleteDate.setDate(autoDeleteDate.getDate() - documentSettings.autoDeleteDays);
      
      const oldDeletedDocs = documents.filter(
        doc => doc.deletedAt && new Date(doc.deletedAt) <= autoDeleteDate
      );
      
      // Permanently delete old documents
      for (const doc of oldDeletedDocs) {
        try {
          await deleteDocument(doc.id);
          console.log(`Auto-deleted old document: ${doc.name}`);
        } catch (error) {
          console.error(`Failed to auto-delete document ${doc.name}:`, error);
        }
      }
      
      // Refresh if any were deleted
      if (oldDeletedDocs.length > 0) {
        await fetchDocuments();
        toast.info('Cleanup Complete', {
          description: `${oldDeletedDocs.length} old document(s) permanently deleted (older than ${documentSettings.autoDeleteDays} days)`,
        });
      }
    };
    
    initDocuments();
  }, [fetchDocuments, documents, deleteDocument, documentSettings.autoDeleteDays]);

  // Filter active (non-deleted) and recently deleted documents
  const activeDocuments = documents.filter(doc => !doc.deletedAt);
  const recentlyDeletedThreshold = new Date();
  recentlyDeletedThreshold.setDate(recentlyDeletedThreshold.getDate() - documentSettings.recentlyDeletedDays);
  const recentlyDeleted = documents.filter(
    doc => doc.deletedAt && new Date(doc.deletedAt) > recentlyDeletedThreshold
  );

  // Calculate counts from active documents only
  const resumes = activeDocuments.filter(doc => doc.type === 'resume' || doc.type === 'cv');
  const coverLetters = activeDocuments.filter(doc => doc.type === 'cover-letter');
  const resumeCount = resumes.length;
  const coverLetterCount = coverLetters.length;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, docType: 'resume' | 'cv' | 'cover-letter' | 'other' = 'other') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        await addDocument({
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          type: docType,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          version: 1,
        });
        
        toast.success('File Uploaded', {
          description: `${file.name} has been uploaded successfully`,
        });
        setIsUploadDialogOpen(false);
      } catch (error) {
        toast.error('Upload Failed', {
          description: error instanceof Error ? error.message : 'Failed to upload file',
        });
      }
    }
  };

  const handleNewDocument = async () => {
    if (!newDocName.trim()) {
      toast.error('Invalid Input', {
        description: 'Please enter a document name',
      });
      return;
    }

    try {
      // Create document with template content based on type
      let defaultContent = '';
      if (newDocType === 'resume') {
        defaultContent = `# ${newDocName}

## Contact Information
- Email: 
- Phone: 
- Location: 

## Summary
Write a brief professional summary here...

## Experience
### Job Title - Company Name
*Dates*
- Achievement or responsibility
- Achievement or responsibility

## Education
### Degree - Institution
*Graduation Year*

## Skills
- Skill 1
- Skill 2
- Skill 3`;
      } else if (newDocType === 'cover-letter') {
        defaultContent = `Dear Hiring Manager,

I am writing to express my interest in [Position] at [Company].

[Write your cover letter content here...]

Thank you for considering my application.

Sincerely,
[Your Name]`;
      }

      await addDocument({
        name: newDocName,
        type: newDocType,
        version: 1,
        content: newDocContent || defaultContent,
      });

      toast.success('Document Created', {
        description: `${newDocName} has been created`,
      });
      setIsNewDocDialogOpen(false);
      setNewDocName('');
      setNewDocType('resume');
      setNewDocContent('');
    } catch (error) {
      toast.error('Creation Failed', {
        description: error instanceof Error ? error.message : 'Failed to create document',
      });
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setEditingName(doc.name);
    setEditingContent(doc.content || '');
    setIsEditMode(false);
  };

  const handleSaveDocument = async () => {
    if (!selectedDocument) return;

    try {
      await updateDocument(selectedDocument.id, {
        name: editingName,
        content: editingContent,
      });

      toast.success('Document Updated', {
        description: `${editingName} has been saved`,
      });
      setIsEditMode(false);
    } catch (error) {
      toast.error('Save Failed', {
        description: error instanceof Error ? error.message : 'Failed to save document',
      });
    }
  };

  const handleDeleteDocument = async (doc: Document) => {
    console.log('Soft deleting document:', doc.name, doc.id);
    
    try {
      // Soft delete by setting deletedAt timestamp
      await updateDocument(doc.id, {
        deletedAt: new Date(),
      });
      
      console.log('Document soft deleted successfully');
      
      toast.success('Document Deleted', {
        description: `${doc.name} moved to recently deleted`,
      });
      
      // Clear selection if the deleted document was selected
      if (selectedDocument?.id === doc.id) {
        setSelectedDocument(null);
        setIsEditMode(false);
      }
      
      // Refresh the documents list to ensure UI updates
      await fetchDocuments();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Delete Failed', {
        description: error instanceof Error ? error.message : 'Failed to delete document',
      });
    }
  };

  const handleRestoreDocument = async (doc: Document) => {
    try {
      // Restore by clearing deletedAt
      await updateDocument(doc.id, {
        deletedAt: undefined,
      });
      
      toast.success('Document Restored', {
        description: `${doc.name} has been restored`,
      });
      
      await fetchDocuments();
    } catch (error) {
      toast.error('Restore Failed', {
        description: error instanceof Error ? error.message : 'Failed to restore document',
      });
    }
  };

  const handlePermanentDelete = async (doc: Document) => {
    if (!window.confirm(`Permanently delete "${doc.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteDocument(doc.id);
      
      toast.success('Document Permanently Deleted', {
        description: `${doc.name} has been permanently deleted`,
      });
      
      await fetchDocuments();
    } catch (error) {
      toast.error('Delete Failed', {
        description: error instanceof Error ? error.message : 'Failed to permanently delete document',
      });
    }
  };

  const handleCreateCoverLetter = async () => {
    if (!coverLetterName.trim()) {
      toast.error('Invalid Input', {
        description: 'Please enter a cover letter name',
      });
      return;
    }

    try {
      // Build cover letter content with template
      const content = `Dear Hiring Manager,

I am writing to express my interest in the ${coverLetterPosition || '[Position]'} position at ${coverLetterCompany || '[Company]'}.

${coverLetterContent}

Thank you for considering my application.

Sincerely,
[Your Name]`;

      await addDocument({
        name: coverLetterName,
        type: 'cover-letter',
        version: 1,
        content,
        notes: `Company: ${coverLetterCompany}, Position: ${coverLetterPosition}`,
      });

      toast.success('Cover Letter Created', {
        description: `${coverLetterName} has been created`,
      });
      setIsCoverLetterDialogOpen(false);
      setCoverLetterName('');
      setCoverLetterCompany('');
      setCoverLetterPosition('');
      setCoverLetterContent('');
    } catch (error) {
      toast.error('Creation Failed', {
        description: error instanceof Error ? error.message : 'Failed to create cover letter',
      });
    }
  };
  
  return (
    <>
      <div className="flex gap-6 h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <div className="w-56 flex flex-col gap-4 shrink-0">
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button size="sm" className="flex-1" onClick={() => setIsNewDocDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>

          {/* Document Groups */}
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {/* Resumes Group */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Resumes
                  </h3>
                  <Badge variant="secondary" className="h-5 text-xs">
                    {resumeCount}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {resumes.length === 0 ? (
                    <div className="px-2 py-8 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground mb-2">No resumes yet</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs"
                        onClick={() => {
                          setNewDocType('resume');
                          setIsNewDocDialogOpen(true);
                        }}
                      >
                        Create Resume
                      </Button>
                    </div>
                  ) : (
                    resumes.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleViewDocument(doc)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedDocument?.id === doc.id
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              v{doc.version} · {new Date(doc.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedDocument?.id === doc.id && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <Separator />

              {/* Cover Letters Group */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Cover Letters
                  </h3>
                  <Badge variant="secondary" className="h-5 text-xs">
                    {coverLetterCount}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {coverLetters.length === 0 ? (
                    <div className="px-2 py-8 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground mb-2">No cover letters yet</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs"
                        onClick={() => setIsCoverLetterDialogOpen(true)}
                      >
                        Create Cover Letter
                      </Button>
                    </div>
                  ) : (
                    coverLetters.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleViewDocument(doc)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedDocument?.id === doc.id
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              v{doc.version} · {new Date(doc.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedDocument?.id === doc.id && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Recently Deleted Group */}
              {recentlyDeleted.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Recently Deleted
                      </h3>
                      <Badge variant="destructive" className="h-5 text-xs">
                        {recentlyDeleted.length}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {recentlyDeleted.map((doc) => (
                        <div
                          key={doc.id}
                          className="px-3 py-2 rounded-md bg-muted/50 opacity-60"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-muted-foreground">
                                {doc.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Deleted {doc.deletedAt ? new Date(doc.deletedAt).toLocaleDateString() : ''}
                              </p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleRestoreDocument(doc)}
                                title="Restore"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                onClick={() => handlePermanentDelete(doc)}
                                title="Delete Forever"
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Preview Area */}
        <div className="flex-1 min-w-0">
          {selectedDocument ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    {isEditMode ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="text-sm font-semibold h-8"
                      />
                    ) : (
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold truncate">{selectedDocument.name}</h2>
                        <p className="text-xs text-muted-foreground">
                          {selectedDocument.type} · v{selectedDocument.version} · {new Date(selectedDocument.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {isEditMode ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => {
                            setIsEditMode(false);
                            setEditingName(selectedDocument.name);
                            setEditingContent(selectedDocument.content || '');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" className="h-8" onClick={handleSaveDocument}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditMode(true)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {selectedDocument.content && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Download"
                            onClick={() => {
                              const content = selectedDocument.content || '';
                              let fileName = selectedDocument.name;
                              let mimeType = 'text/plain';
                              
                              // Set file extension based on current view format
                              if (viewFormat === 'pdf') {
                                fileName = `${fileName}.pdf`;
                                mimeType = 'application/pdf';
                              } else if (viewFormat === 'markdown') {
                                fileName = `${fileName}.md`;
                                mimeType = 'text/markdown';
                              } else if (viewFormat === 'richtext') {
                                fileName = `${fileName}.html`;
                                mimeType = 'text/html';
                              } else {
                                fileName = `${fileName}.txt`;
                              }
                              
                              const blob = new Blob([content], { type: mimeType });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = fileName;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete"
                          onClick={() => handleDeleteDocument(selectedDocument)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 p-0 overflow-auto flex flex-col">
                {selectedDocument.fileName ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedDocument.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedDocument.fileSize
                            ? `${(selectedDocument.fileSize / 1024).toFixed(2)} KB`
                            : 'File uploaded'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        File preview not available. Download to view.
                      </p>
                    </div>
                  </div>
                ) : isEditMode ? (
                  <Textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full h-full min-h-full font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0"
                    placeholder="Write your document content here..."
                  />
                ) : (
                  <Tabs value={viewFormat} onValueChange={(value) => setViewFormat(value as 'pdf' | 'markdown' | 'richtext' | 'plain')} className="flex-1 flex flex-col">
                    <div className="px-6 pt-4 pb-2 border-b">
                      <TabsList className="grid w-full max-w-2xl grid-cols-4">
                        <TabsTrigger value="pdf" className="text-xs">
                          <File className="h-3 w-3 mr-1.5" />
                          PDF
                        </TabsTrigger>
                        <TabsTrigger value="markdown" className="text-xs">
                          <FileCode className="h-3 w-3 mr-1.5" />
                          Markdown
                        </TabsTrigger>
                        <TabsTrigger value="richtext" className="text-xs">
                          <Type className="h-3 w-3 mr-1.5" />
                          Rich Text
                        </TabsTrigger>
                        <TabsTrigger value="plain" className="text-xs">
                          <FileType className="h-3 w-3 mr-1.5" />
                          Plain Text
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="pdf" className="flex-1 m-0 overflow-hidden flex flex-col">
                      {numPages && numPages > 1 && (
                        <div className="border-b px-4 py-2 flex items-center justify-center gap-4 bg-muted/30">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          >
                            ←
                          </Button>
                          <span className="text-xs text-muted-foreground min-w-[80px] text-center">
                            Page {currentPage} of {numPages}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            disabled={currentPage >= numPages}
                            onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
                          >
                            →
                          </Button>
                        </div>
                      )}
                      <ScrollArea className="flex-1">
                        <div className="flex flex-col items-center p-6 space-y-4 w-full">
                          {generatedPdfUrl ? (
                            <PDFDocument
                              file={generatedPdfUrl}
                              onLoadSuccess={({ numPages }) => {
                                setNumPages(numPages);
                                setCurrentPage(1);
                              }}
                              onLoadError={(error) => {
                                console.error('PDF load error:', error);
                                toast.error('Failed to load PDF', {
                                  description: 'Unable to render PDF. Try viewing in another format.',
                                });
                              }}
                              className="w-full flex flex-col items-center"
                            >
                              {numPages && Array.from(new Array(numPages), (_, index) => (
                                <PDFPage
                                  key={`page_${index + 1}`}
                                  pageNumber={index + 1}
                                  className="mb-4 shadow-lg max-w-full"
                                  renderTextLayer={true}
                                  renderAnnotationLayer={true}
                                  scale={0.85}
                                  width={Math.min(window.innerWidth - 350, 700)}
                                />
                              ))}
                            </PDFDocument>
                          ) : (
                            <div className="text-center py-12">
                              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                              <p className="text-sm text-muted-foreground mb-2">
                                {selectedDocument.content 
                                  ? 'Generating PDF preview...' 
                                  : 'No content available to display as PDF'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Try switching to Markdown or Plain Text view
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="markdown" className="flex-1 m-0 overflow-hidden">
                      <ScrollArea className="h-full">
                        <div className="prose prose-sm dark:prose-invert max-w-none p-6">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          >
                            {selectedDocument.content || '*No content available*'}
                          </ReactMarkdown>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="richtext" className="flex-1 m-0 overflow-hidden">
                      <ScrollArea className="h-full">
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none p-6"
                          dangerouslySetInnerHTML={{ 
                            __html: selectedDocument.content?.replace(/\n/g, '<br/>') || '<em>No content available</em>' 
                          }}
                        />
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="plain" className="flex-1 m-0 overflow-hidden">
                      <ScrollArea className="h-full">
                        <pre className="whitespace-pre-wrap font-mono text-sm p-6">
                          {selectedDocument.content || 'No content available'}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Document Selected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a document from the sidebar to view or edit it
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setIsNewDocDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </Button>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a resume, cover letter, or other document. Supported formats: PDF, DOC, DOCX
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'other')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The document will be automatically categorized based on its content.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Document Dialog */}
      <Dialog open={isNewDocDialogOpen} onOpenChange={setIsNewDocDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Create a new document from scratch or use a template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doc-name">Document Name</Label>
              <Input 
                id="doc-name" 
                placeholder="My Resume v2"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-type">Document Type</Label>
              <select
                id="doc-type"
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value as 'resume' | 'cover-letter')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="resume">Resume</option>
                <option value="cover-letter">Cover Letter</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-content">Content (Optional)</Label>
              <Textarea
                id="doc-content"
                placeholder="Leave empty to use a template..."
                className="min-h-[150px] font-mono text-sm"
                value={newDocContent}
                onChange={(e) => setNewDocContent(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If left empty, a template will be automatically generated
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsNewDocDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewDocument}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cover Letter Dialog */}
      <Dialog open={isCoverLetterDialogOpen} onOpenChange={setIsCoverLetterDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Cover Letter</DialogTitle>
            <DialogDescription>
              Create a customized cover letter for your application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="letter-name">Cover Letter Name</Label>
              <Input 
                id="letter-name" 
                placeholder="Software Engineer - Google"
                value={coverLetterName}
                onChange={(e) => setCoverLetterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input 
                id="company" 
                placeholder="Google"
                value={coverLetterCompany}
                onChange={(e) => setCoverLetterCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                placeholder="Senior Software Engineer"
                value={coverLetterPosition}
                onChange={(e) => setCoverLetterPosition(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your cover letter here..."
                className="min-h-[200px]"
                value={coverLetterContent}
                onChange={(e) => setCoverLetterContent(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCoverLetterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCoverLetter}>Create Cover Letter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

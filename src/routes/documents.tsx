import { createFileRoute } from '@tanstack/react-router';
import { FileText, Plus, Upload, Pencil, Download, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { useDocumentsStore } from '@/stores';
import { useSettingsStore } from '@/stores/settingsStore';
import type { Document } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
});

function DocumentsPage() {
  const { documents, fetchDocuments, addDocument, updateDocument, deleteDocument } = useDocumentsStore();
  const { documents: documentSettings } = useSettingsStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewDocDialogOpen, setIsNewDocDialogOpen] = useState(false);
  const [isCoverLetterDialogOpen, setIsCoverLetterDialogOpen] = useState(false);
  const [isViewDocDialogOpen, setIsViewDocDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'deleted'>('recent');
  const resumeInputRef = useRef<HTMLInputElement>(null);

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

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileUpload(event, 'resume');
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
    setIsViewDocDialogOpen(true);
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
      setIsViewDocDialogOpen(false);
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
      
      if (isViewDocDialogOpen && selectedDocument?.id === doc.id) {
        setIsViewDocDialogOpen(false);
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
      <PageHeader title="Documents" description="Manage your resumes, CVs, and cover letters" />

      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{resumeCount} Resumes</Badge>
            <Badge variant="outline">{coverLetterCount} Cover Letters</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button onClick={() => setIsNewDocDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>

        {/* Document Categories */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Resumes</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Your resume versions and templates</CardDescription>
            </CardHeader>
            <CardContent>
              {resumeCount === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-3">No resumes uploaded yet.</p>
                  <Button size="sm" variant="outline" onClick={() => resumeInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resume
                  </Button>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {resumes.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            v{doc.version} · {doc.fileName || (doc.content ? 'Text document' : 'No file')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDocument(doc)}>
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            console.log('Resume delete button clicked!', doc);
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteDocument(doc);
                          }}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Cover Letters</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Customized cover letters for applications</CardDescription>
            </CardHeader>
            <CardContent>
              {coverLetterCount === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-3">No cover letters yet.</p>
                  <Button size="sm" variant="outline" onClick={() => setIsCoverLetterDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Cover Letter
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {coverLetters.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            v{doc.version} · {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDocument(doc)}>
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            console.log('Cover letter delete button clicked!', doc);
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteDocument(doc);
                          }}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Recently updated and deleted documents</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('recent')}
                >
                  Recent
                </Button>
                {recentlyDeleted.length > 0 && (
                  <Button
                    variant={activeTab === 'deleted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('deleted')}
                  >
                    Recently Deleted ({recentlyDeleted.length})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'recent' ? (
              // Recent Documents Tab
              activeDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No documents to display. Upload or create your first document!
                </p>
              ) : (
                <div className="space-y-2">
                  {activeDocuments
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 5)
                    .map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} · Updated {new Date(doc.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewDocument(doc)}>
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              console.log('Recent document delete button clicked!', doc);
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteDocument(doc);
                            }}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )
            ) : (
              // Recently Deleted Tab
              recentlyDeleted.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recently deleted documents
                </p>
              ) : (
                <div className="space-y-2">
                  {recentlyDeleted
                    .sort((a, b) => {
                      const aTime = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
                      const bTime = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
                      return bTime - aTime;
                    })
                    .map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} · Deleted {doc.deletedAt ? new Date(doc.deletedAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRestoreDocument(doc)}
                          >
                            Restore
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handlePermanentDelete(doc)}
                          >
                            Delete Forever
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
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

      {/* View/Edit Document Dialog */}
      <Dialog open={isViewDocDialogOpen} onOpenChange={setIsViewDocDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="pr-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                {isEditMode ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="text-lg font-semibold"
                  />
                ) : (
                  <DialogTitle className="truncate">{selectedDocument?.name}</DialogTitle>
                )}
                <DialogDescription className="truncate">
                  {selectedDocument?.type} · v{selectedDocument?.version}
                  {selectedDocument?.updatedAt && (
                    <> · Last updated {new Date(selectedDocument.updatedAt).toLocaleString()}</>
                  )}
                </DialogDescription>
              </div>
              <div className="flex gap-2 shrink-0">
                {isEditMode ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => {
                      setIsEditMode(false);
                      setEditingName(selectedDocument?.name || '');
                      setEditingContent(selectedDocument?.content || '');
                    }}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveDocument}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {selectedDocument?.content && (
                      <Button variant="outline" size="sm" onClick={() => {
                        const content = selectedDocument.content || '';
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedDocument.name}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </DialogHeader>
          <Separator />
          <div className="flex-1 overflow-hidden">
            {selectedDocument?.fileName ? (
              <div className="text-center py-12 space-y-4">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedDocument.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.fileSize ? `${(selectedDocument.fileSize / 1024).toFixed(2)} KB` : 'File uploaded'}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  File preview not available. Download to view.
                </p>
              </div>
            ) : isEditMode ? (
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full h-full min-h-[400px] font-mono text-sm resize-none"
                placeholder="Write your document content here..."
              />
            ) : (
              <div className="w-full h-full overflow-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-muted rounded-lg min-h-[400px]">
                  {selectedDocument?.content || 'No content available'}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

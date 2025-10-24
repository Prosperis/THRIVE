import { useVirtualizer } from '@tanstack/react-virtual';
import { Calendar, CheckCircle2, Clock, Code, Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DurationSlider, TIME_LIMIT_PRESETS } from '@/components/ui/duration-slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatRelativeTime } from '@/lib/utils';
import { useInterviewPrepStore } from '@/stores/interviewPrepStore';
import type { ChallengeStatus, QuestionDifficulty } from '@/types/interviewPrep';

const CHALLENGE_TYPES = [
  { value: 'coding', label: 'Coding Challenge', icon: '💻' },
  { value: 'system-design', label: 'System Design', icon: '🏗️' },
  { value: 'take-home', label: 'Take-Home Project', icon: '📦' },
  { value: 'technical-assessment', label: 'Technical Assessment', icon: '📝' },
] as const;

const CHALLENGE_STATUSES = [
  { value: 'not-started', label: 'Not Started', color: 'bg-gray-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'submitted', label: 'Submitted', color: 'bg-purple-500' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-orange-500' },
] as const;

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'hard', label: 'Hard', color: 'text-red-600' },
] as const;

export function ChallengesTab() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ChallengeStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(60); // in minutes
  const scrollRef = useRef<HTMLDivElement>(null);

  const challenges = useInterviewPrepStore((state) => state.challenges);
  const addChallenge = useInterviewPrepStore((state) => state.addChallenge);
  const updateChallenge = useInterviewPrepStore((state) => state.updateChallenge);
  const deleteChallenge = useInterviewPrepStore((state) => state.deleteChallenge);

  const filteredChallenges = challenges.filter((c) => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const virtualizer = useVirtualizer({
    count: filteredChallenges.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 300, // Estimated height of each challenge card
    overscan: 3,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const tagsStr = formData.get('tags') as string;
    const tags = tagsStr
      ? tagsStr
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;

    const dueDateStr = formData.get('dueDate') as string;
    const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;

    const timeLimit = formData.get('timeLimit') as string;

    const challengeData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      companyName: (formData.get('companyName') as string) || undefined,
      type: formData.get('type') as
        | 'coding'
        | 'system-design'
        | 'take-home'
        | 'technical-assessment',
      status: formData.get('status') as ChallengeStatus,
      difficulty: (formData.get('difficulty') as QuestionDifficulty) || undefined,
      timeLimit: timeLimit ? Number.parseInt(timeLimit, 10) : undefined,
      dueDate,
      notes: (formData.get('notes') as string) || undefined,
      solution: (formData.get('solution') as string) || undefined,
      feedbackReceived: (formData.get('feedbackReceived') as string) || undefined,
      tags,
    };

    if (editingId) {
      updateChallenge(editingId, challengeData);
      setEditingId(null);
    } else {
      addChallenge(challengeData);
    }

    setShowAddDialog(false);
    e.currentTarget.reset();
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowAddDialog(true);
  };

  const handleStatusChange = (id: string, status: ChallengeStatus) => {
    const updates: Record<string, unknown> = { status };
    if (status === 'in-progress' && !challenges.find((c) => c.id === id)?.startedAt) {
      updates.startedAt = new Date();
    }
    if (status === 'completed' && !challenges.find((c) => c.id === id)?.completedAt) {
      updates.completedAt = new Date();
    }
    if (status === 'submitted' && !challenges.find((c) => c.id === id)?.submittedAt) {
      updates.submittedAt = new Date();
    }
    updateChallenge(id, updates);
  };

  const editingChallenge = editingId ? challenges.find((c) => c.id === editingId) : null;

  // Update timeLimit state when editing a challenge
  useEffect(() => {
    if (editingChallenge?.timeLimit !== undefined) {
      setTimeLimit(editingChallenge.timeLimit);
    } else {
      setTimeLimit(60); // Reset to default
    }
  }, [editingChallenge]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Challenges</CardTitle>
          <CardDescription>
            Track coding challenges, take-home projects, and assessments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(v) => setFilterStatus(v as ChallengeStatus | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {CHALLENGE_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog
              open={showAddDialog}
              onOpenChange={(open) => {
                setShowAddDialog(open);
                if (!open) setEditingId(null);
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Challenge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingId ? 'Edit' : 'Add'} Technical Challenge</DialogTitle>
                    <DialogDescription>
                      Track a new coding challenge or assessment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Challenge Title</Label>
                      <Input name="title" required defaultValue={editingChallenge?.title} />
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name (Optional)</Label>
                      <Input name="companyName" defaultValue={editingChallenge?.companyName} />
                    </div>

                    {/* Type and Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" required defaultValue={editingChallenge?.type}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CHALLENGE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          name="status"
                          required
                          defaultValue={editingChallenge?.status || 'not-started'}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {CHALLENGE_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        name="description"
                        required
                        rows={4}
                        defaultValue={editingChallenge?.description}
                      />
                    </div>

                    {/* Difficulty and Time Limit */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty (Optional)</Label>
                        <Select name="difficulty" defaultValue={editingChallenge?.difficulty}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            {DIFFICULTY_LEVELS.map((diff) => (
                              <SelectItem key={diff.value} value={diff.value}>
                                {diff.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeLimit">Time Limit</Label>
                        <DurationSlider
                          value={timeLimit}
                          onChange={setTimeLimit}
                          unit="minutes"
                          min={15}
                          max={240}
                          step={5}
                          presets={TIME_LIMIT_PRESETS}
                          showPresets={true}
                        />
                        <input type="hidden" name="timeLimit" value={timeLimit} />
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date (Optional)</Label>
                      <Input
                        name="dueDate"
                        type="datetime-local"
                        defaultValue={
                          editingChallenge?.dueDate
                            ? new Date(editingChallenge.dueDate).toISOString().slice(0, 16)
                            : ''
                        }
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        name="notes"
                        rows={3}
                        placeholder="Approach, key points, requirements..."
                        defaultValue={editingChallenge?.notes}
                      />
                    </div>

                    {/* Solution */}
                    <div className="space-y-2">
                      <Label htmlFor="solution">Your Solution (Optional)</Label>
                      <Textarea
                        name="solution"
                        rows={5}
                        placeholder="Your code or design solution..."
                        defaultValue={editingChallenge?.solution}
                      />
                    </div>

                    {/* Feedback */}
                    <div className="space-y-2">
                      <Label htmlFor="feedbackReceived">Feedback Received (Optional)</Label>
                      <Textarea
                        name="feedbackReceived"
                        rows={3}
                        placeholder="Feedback from reviewers..."
                        defaultValue={editingChallenge?.feedbackReceived}
                      />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        name="tags"
                        placeholder="algorithms, data-structures, react..."
                        defaultValue={editingChallenge?.tags?.join(', ')}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingId ? 'Update' : 'Add'} Challenge</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Challenges List */}
      {filteredChallenges.length > 0 ? (
        <div ref={scrollRef} className="overflow-auto" style={{ maxHeight: '800px' }}>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const challenge = filteredChallenges[virtualRow.index];
              return (
                <div
                  key={challenge.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: '16px',
                  }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Code className="h-5 w-5" />
                            <CardTitle className="text-lg">{challenge.title}</CardTitle>
                            <Badge variant="outline">
                              {CHALLENGE_TYPES.find((t) => t.value === challenge.type)?.icon}{' '}
                              {CHALLENGE_TYPES.find((t) => t.value === challenge.type)?.label}
                            </Badge>
                          </div>
                          {challenge.companyName && (
                            <p className="text-sm text-muted-foreground">
                              Company: {challenge.companyName}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={challenge.status}
                            onValueChange={(value) =>
                              handleStatusChange(challenge.id, value as ChallengeStatus)
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CHALLENGE_STATUSES.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                    {status.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(challenge.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteChallenge(challenge.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>

                      {/* Metadata */}
                      <div className="flex gap-4 flex-wrap text-sm">
                        {challenge.difficulty && (
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className={
                                DIFFICULTY_LEVELS.find((d) => d.value === challenge.difficulty)
                                  ?.color
                              }
                            >
                              {challenge.difficulty}
                            </Badge>
                          </div>
                        )}
                        {challenge.timeLimit && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {challenge.timeLimit} min
                          </div>
                        )}
                        {challenge.dueDate && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Due: {formatRelativeTime(challenge.dueDate)}
                          </div>
                        )}
                        {challenge.completedAt && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed {formatRelativeTime(challenge.completedAt)}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {challenge.tags && challenge.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {challenge.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {challenge.notes && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Notes</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {challenge.notes}
                          </p>
                        </div>
                      )}

                      {/* Solution */}
                      {challenge.solution && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Solution</h4>
                          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                            <code>{challenge.solution}</code>
                          </pre>
                        </div>
                      )}

                      {/* Feedback */}
                      {challenge.feedbackReceived && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Feedback</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {challenge.feedbackReceived}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No challenges yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || filterStatus !== 'all'
                ? 'No challenges match your filters'
                : 'Start tracking your technical challenges and assessments'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Challenge
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

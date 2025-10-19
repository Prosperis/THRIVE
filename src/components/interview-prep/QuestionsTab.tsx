import { BookOpen, Edit, Play, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import {
  COMMON_INTERVIEW_QUESTIONS,
  DIFFICULTY_LEVELS,
  QUESTION_CATEGORIES,
} from '@/data/commonQuestions';
import { useInterviewPrepStore } from '@/stores/interviewPrepStore';
import type { QuestionCategory, QuestionDifficulty } from '@/types/interviewPrep';

export function QuestionsTab() {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAnswerDialog, setShowAnswerDialog] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const questions = useInterviewPrepStore((state) => state.questions);
  const addQuestion = useInterviewPrepStore((state) => state.addQuestion);
  const deleteQuestion = useInterviewPrepStore((state) => state.deleteQuestion);
  const addAnswer = useInterviewPrepStore((state) => state.addAnswer);
  const getAnswersForQuestion = useInterviewPrepStore((state) => state.getAnswersForQuestion);

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchesSearch =
      searchQuery === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleAddCommonQuestion = (question: (typeof COMMON_INTERVIEW_QUESTIONS)[0]) => {
    addQuestion({
      question: question.question,
      category: question.category,
      difficulty: question.difficulty,
      tags: question.tags,
      isCommon: true,
    });
  };

  const handleAddCustomQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addQuestion({
      question: formData.get('question') as string,
      category: formData.get('category') as QuestionCategory,
      difficulty: (formData.get('difficulty') as QuestionDifficulty) || undefined,
      tags: (formData.get('tags') as string)
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isCommon: false,
    });
    setShowAddDialog(false);
    e.currentTarget.reset();
  };

  const handleAddAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedQuestionId) return;

    const formData = new FormData(e.currentTarget);
    const existingAnswers = getAnswersForQuestion(selectedQuestionId);

    addAnswer({
      questionId: selectedQuestionId,
      answer: formData.get('answer') as string,
      notes: (formData.get('notes') as string) || undefined,
      version: existingAnswers.length + 1,
    });

    setShowAnswerDialog(false);
    setSelectedQuestionId(null);
    e.currentTarget.reset();
  };

  const getDifficultyColor = (difficulty?: QuestionDifficulty) => {
    if (!difficulty) return 'default';
    return DIFFICULTY_LEVELS.find((d) => d.value === difficulty)?.color || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Questions Library</CardTitle>
          <CardDescription>Practice common and custom interview questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search questions or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(v) => setSelectedCategory(v as QuestionCategory | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {QUESTION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDifficulty}
              onValueChange={(v) => setSelectedDifficulty(v as QuestionDifficulty | 'all')}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {DIFFICULTY_LEVELS.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <form onSubmit={handleAddCustomQuestion}>
                  <DialogHeader>
                    <DialogTitle>Add Custom Question</DialogTitle>
                    <DialogDescription>
                      Create your own interview question to practice
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Textarea id="question" name="question" required rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {QUESTION_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty (Optional)</Label>
                        <Select name="difficulty">
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" name="tags" placeholder="e.g. javascript, async, promises" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Question</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Common Questions Bank */}
      {questions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Start with Common Questions</CardTitle>
            <CardDescription>
              Add questions from our curated library to your practice list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {COMMON_INTERVIEW_QUESTIONS.map((q, idx) => {
                const alreadyAdded = questions.some((uq) => uq.question === q.question);
                return (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{q.question}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {QUESTION_CATEGORIES.find((c) => c.value === q.category)?.icon}{' '}
                          {q.category}
                        </Badge>
                        {q.difficulty && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${getDifficultyColor(q.difficulty)}`}
                          >
                            {q.difficulty}
                          </Badge>
                        )}
                        {q.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {q.tips && <p className="text-xs text-muted-foreground mt-1">{q.tips}</p>}
                    </div>
                    <Button
                      size="sm"
                      variant={alreadyAdded ? 'secondary' : 'default'}
                      onClick={() => !alreadyAdded && handleAddCommonQuestion(q)}
                      disabled={alreadyAdded}
                    >
                      {alreadyAdded ? 'Added' : 'Add'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Questions */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">My Questions ({filteredQuestions.length})</h3>
          {filteredQuestions.map((question) => {
            const questionAnswers = getAnswersForQuestion(question.id);
            const hasAnswer = questionAnswers.length > 0;

            return (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <CardTitle className="text-base">{question.question}</CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">
                          {QUESTION_CATEGORIES.find((c) => c.value === question.category)?.icon}{' '}
                          {question.category}
                        </Badge>
                        {question.difficulty && (
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(question.difficulty)}
                          >
                            {question.difficulty}
                          </Badge>
                        )}
                        {question.isCommon && <Badge variant="secondary">Common</Badge>}
                        {question.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedQuestionId(question.id);
                          setShowAnswerDialog(true);
                        }}
                      >
                        {hasAnswer ? <Edit className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {hasAnswer && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Your Answer ({questionAnswers.length} version
                          {questionAnswers.length > 1 ? 's' : ''})
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {questionAnswers[questionAnswers.length - 1].answer}
                      </p>
                      {questionAnswers[questionAnswers.length - 1].notes && (
                        <p className="text-xs text-muted-foreground italic">
                          Note: {questionAnswers[questionAnswers.length - 1].notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      ) : questions.length > 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No questions match your filters
          </CardContent>
        </Card>
      ) : null}

      {/* Answer Dialog */}
      <Dialog open={showAnswerDialog} onOpenChange={setShowAnswerDialog}>
        <DialogContent className="max-w-3xl">
          <form onSubmit={handleAddAnswer}>
            <DialogHeader>
              <DialogTitle>Practice Your Answer</DialogTitle>
              <DialogDescription>Write and refine your answer to this question</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="answer">Your Answer</Label>
                <Textarea
                  id="answer"
                  name="answer"
                  required
                  rows={8}
                  placeholder="Write your answer here using the STAR method (Situation, Task, Action, Result) for behavioral questions..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Add any notes, improvements, or things to remember..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Answer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

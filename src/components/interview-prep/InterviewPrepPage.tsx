import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Building2, Code, TrendingUp } from 'lucide-react';
import { useInterviewPrepStore } from '@/stores/interviewPrepStore';
import { QuestionsTab } from '@/components/interview-prep/QuestionsTab';
import { CompanyNotesTab } from '@/components/interview-prep/CompanyNotesTab';
import { ChallengesTab } from '@/components/interview-prep/ChallengesTab';
import { PrepStatsOverview } from '@/components/interview-prep/PrepStatsOverview';

export function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState('questions');
  const stats = useInterviewPrepStore((state) => state.getStats());

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview Preparation</h1>
          <p className="text-muted-foreground mt-1">
            Practice questions, research companies, and track technical challenges
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <PrepStatsOverview stats={stats} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Questions</span>
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Companies</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <QuestionsTab />
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <CompanyNotesTab />
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <ChallengesTab />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Practice Progress</CardTitle>
              <CardDescription>Track your interview preparation journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Question Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Questions Answered</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.answeredQuestions} / {stats.totalQuestions}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${stats.totalQuestions > 0 ? (stats.answeredQuestions / stats.totalQuestions) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Practice Sessions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Practice Sessions</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.practiceSessionsCount} total
                    </span>
                  </div>
                  {stats.averageRating > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Average Rating: {stats.averageRating.toFixed(1)} / 5.0
                    </div>
                  )}
                </div>

                {/* Companies Researched */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Companies Researched</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.companiesResearched} companies
                    </span>
                  </div>
                </div>

                {/* Technical Challenges */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Technical Challenges</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.challengesCompleted} completed • {stats.challengesPending} pending
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{
                        width: `${(stats.challengesCompleted + stats.challengesPending) > 0 ? (stats.challengesCompleted / (stats.challengesCompleted + stats.challengesPending)) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Category Breakdown */}
                {Object.keys(stats.questionsByCategory).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Questions by Category</h3>
                    <div className="space-y-2">
                      {Object.entries(stats.questionsByCategory).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{category.replace(/-/g, ' ')}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

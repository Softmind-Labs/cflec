import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { StatsBar } from '@/components/ui/stats-bar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { 
  PlayCircle, 
  CheckCircle,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Award,
  Clock,
  Layers,
  Cpu
} from 'lucide-react';
import type { Module, ModuleContent, Quiz, UserProgress } from '@/types';
import { CERTIFICATE_INFO } from '@/types';

export default function ModulePlayer() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [module, setModule] = useState<Module | null>(null);
  const [content, setContent] = useState<ModuleContent[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;

      const [moduleRes, contentRes, quizRes, progressRes] = await Promise.all([
        supabase.from('modules').select('*').eq('id', id).single(),
        supabase.from('module_content').select('*').eq('module_id', id).order('order_index'),
        supabase.from('quizzes').select('*').eq('module_id', id).order('order_index'),
        supabase.from('user_progress').select('*').eq('module_id', id).eq('user_id', user.id).maybeSingle(),
      ]);

      if (moduleRes.data) setModule(moduleRes.data as Module);
      if (contentRes.data) setContent(contentRes.data as ModuleContent[]);
      if (quizRes.data) setQuizzes(quizRes.data as Quiz[]);
      if (progressRes.data) setProgress(progressRes.data as UserProgress);
      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  const markVideoComplete = async () => {
    if (!user || !id) return;

    if (progress) {
      await supabase
        .from('user_progress')
        .update({ video_completed: true })
        .eq('id', progress.id);
      setProgress({ ...progress, video_completed: true });
    } else {
      const { data } = await supabase
        .from('user_progress')
        .insert({ user_id: user.id, module_id: id, video_completed: true })
        .select()
        .single();
      if (data) setProgress(data as UserProgress);
    }

    toast({
      title: 'Video Completed!',
      description: 'Great job! Now take the quiz to complete this module.',
    });
    setShowQuiz(true);
  };

  const handleQuizSubmit = async () => {
    if (!user || !id || !progress) return;

    const correctAnswers = quizzes.filter(
      (q, index) => selectedAnswers[index] === q.correct_answer
    ).length;
    const score = Math.round((correctAnswers / quizzes.length) * 100);
    const passed = score >= 70;

    await supabase
      .from('user_progress')
      .update({ 
        quiz_score: score, 
        quiz_passed: passed,
        completed_at: passed ? new Date().toISOString() : null
      })
      .eq('id', progress.id);

    setProgress({ ...progress, quiz_score: score, quiz_passed: passed });
    setQuizSubmitted(true);

    toast({
      title: passed ? '🎉 Quiz Passed!' : 'Quiz Not Passed',
      description: passed 
        ? `You scored ${score}%! Module completed.`
        : `You scored ${score}%. You need 70% to pass. Try again!`,
      variant: passed ? 'default' : 'destructive',
    });
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuiz(0);
    setQuizSubmitted(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!module) {
    return (
      <MainLayout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold">Module not found</h1>
          <Link to="/modules">
            <Button className="mt-4">Back to Modules</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const quizScore = progress?.quiz_score || 0;
  const quizPassed = progress?.quiz_passed || false;
  const certInfo = CERTIFICATE_INFO[module.certificate_level];
  const completedSteps = [progress?.video_completed, quizPassed].filter(Boolean).length;

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-muted/50 border-b">
        <div className="container py-6">
          {/* Breadcrumbs */}
          <BreadcrumbNav
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Modules', href: '/modules' },
              { label: module.title },
            ]}
          />

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`certificate-${module.certificate_level}`}>
                  {module.certificate_level.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">Module {module.module_number}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
              {module.description && (
                <p className="text-muted-foreground max-w-2xl">{module.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {progress?.video_completed && <CheckCircle className="h-6 w-6 text-[hsl(var(--cflp-green))]" />}
              {quizPassed && <Award className="h-6 w-6 text-[hsl(var(--cflp-gold))]" />}
            </div>
          </div>

          {/* Stats Bar */}
          <StatsBar
            items={[
              { label: 'Duration', value: `${module.duration_minutes} min`, icon: <Clock className="h-4 w-4" /> },
              { label: 'Certificate', value: certInfo.name, icon: <Award className="h-4 w-4" /> },
              { label: 'Simulation', value: module.has_simulation ? 'Included' : 'None', icon: <Cpu className="h-4 w-4" /> },
              { label: 'Progress', value: `${completedSteps}/2 complete`, icon: <Layers className="h-4 w-4" /> },
            ]}
          />
        </div>
      </div>

      <div className="container py-8">
        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Module Progress</span>
                  <span>{completedSteps}/2 complete</span>
                </div>
                <Progress 
                  value={(completedSteps / 2) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!showQuiz ? (
              <>
                {/* Video Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Video Lesson
                    </CardTitle>
                    <CardDescription>{module.duration_minutes} minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Video player placeholder</p>
                        <p className="text-sm text-muted-foreground">
                          (Video content would be loaded here)
                        </p>
                      </div>
                    </div>
                    {!progress?.video_completed ? (
                      <Button onClick={markVideoComplete} className="w-full">
                        Mark as Complete & Take Quiz
                      </Button>
                    ) : (
                      <Button onClick={() => setShowQuiz(true)} className="w-full" variant="outline">
                        <CheckCircle className="mr-2 h-4 w-4 text-[hsl(var(--cflp-green))]" />
                        Video Completed - Go to Quiz
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Reading Materials */}
                {content.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Reading Materials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible>
                        {content.map((item, index) => (
                          <AccordionItem key={item.id} value={`item-${index}`}>
                            <AccordionTrigger>{item.title}</AccordionTrigger>
                            <AccordionContent>
                              <div className="prose prose-sm max-w-none">
                                {item.content || 'Content coming soon...'}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Quiz Section */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Module Quiz
                  </CardTitle>
                  <CardDescription>
                    {quizSubmitted 
                      ? `Your score: ${quizScore}%`
                      : `Question ${currentQuiz + 1} of ${quizzes.length}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quizzes.length > 0 ? (
                    quizSubmitted ? (
                      <div className="text-center py-8">
                        <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          quizPassed ? 'bg-[hsl(var(--cflp-green)/0.2)]' : 'bg-destructive/20'
                        }`}>
                          {quizPassed ? (
                            <CheckCircle className="h-10 w-10 text-[hsl(var(--cflp-green))]" />
                          ) : (
                            <HelpCircle className="h-10 w-10 text-destructive" />
                          )}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          {quizPassed ? 'Congratulations!' : 'Keep Learning!'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          You scored {quizScore}%. {quizPassed ? 'You passed!' : 'You need 70% to pass.'}
                        </p>
                        {!quizPassed && (
                          <Button onClick={resetQuiz}>Try Again</Button>
                        )}
                        {quizPassed && (
                          <Link to="/modules">
                            <Button>Continue Learning</Button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="font-medium text-lg">{quizzes[currentQuiz]?.question}</p>
                        <div className="space-y-3">
                          {(quizzes[currentQuiz]?.options as string[])?.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuiz]: index })}
                              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                                selectedAnswers[currentQuiz] === index
                                  ? 'border-primary bg-primary/10'
                                  : 'border-muted hover:border-muted-foreground/50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentQuiz(Math.max(0, currentQuiz - 1))}
                            disabled={currentQuiz === 0}
                          >
                            Previous
                          </Button>
                          {currentQuiz < quizzes.length - 1 ? (
                            <Button
                              onClick={() => setCurrentQuiz(currentQuiz + 1)}
                              disabled={selectedAnswers[currentQuiz] === undefined}
                            >
                              Next
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              onClick={handleQuizSubmit}
                              disabled={Object.keys(selectedAnswers).length !== quizzes.length}
                            >
                              Submit Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No quiz questions available for this module yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 p-0">
                <div className="flex items-center justify-between px-7 py-4 border-b">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{module.duration_minutes} min</span>
                </div>
                <div className="flex items-center justify-between px-7 py-4 border-b">
                  <span className="text-muted-foreground">Certificate</span>
                  <Badge className={`certificate-${module.certificate_level}`}>
                    {module.certificate_level.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-7 py-4">
                  <span className="text-muted-foreground">Simulation</span>
                  <span className="font-medium">{module.has_simulation ? 'Yes' : 'No'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {progress?.video_completed ? (
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--cflp-green))]" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2" />
                  )}
                  <span>Watch Video</span>
                </div>
                <div className="flex items-center gap-3">
                  {quizPassed ? (
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--cflp-green))]" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2" />
                  )}
                  <span>Pass Quiz (70%+)</span>
                </div>
                {module.has_simulation && (
                  <div className="flex items-center gap-3">
                    {progress?.simulation_completed ? (
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--cflp-green))]" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2" />
                    )}
                    <span>Complete Simulation</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

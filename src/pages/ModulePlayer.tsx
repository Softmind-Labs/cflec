import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
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
  Zap
} from 'lucide-react';
import type { Module, ModuleContent, Quiz, UserProgress } from '@/types';
import { CERTIFICATE_INFO } from '@/types';
import { CERT_COLORS } from '@/lib/cert-colors';

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
      title: passed ? 'Quiz Passed!' : 'Quiz Not Passed',
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
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
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
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12 text-center">
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
  const certColor = CERT_COLORS[module.certificate_level];
  const completedSteps = [progress?.video_completed, quizPassed].filter(Boolean).length;
  const totalSteps = module.has_simulation ? 3 : 2;

  return (
    <MainLayout>
      {/* Hero Section — clean white bg */}
      <div className="border-b border-[rgba(0,0,0,0.06)]">
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12">
          <BreadcrumbNav
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Modules', href: '/modules' },
              { label: module.title },
            ]}
          />

          <div className="flex items-start justify-between gap-4 mt-4">
            <div className="flex-1">
              {/* Certificate badge */}
              <span
                className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border"
                style={{
                  backgroundColor: certColor.bg,
                  color: certColor.accent,
                  borderColor: certColor.border,
                }}
              >
                {certInfo.name}
              </span>

              <h1 className="font-display font-bold tracking-[-0.03em] mt-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
                {module.title}
              </h1>

              {module.description && (
                <p className="text-muted-foreground text-[0.9375rem] mt-2 max-w-[600px]">
                  {module.description}
                </p>
              )}

              {/* Inline meta row */}
              <div className="flex items-center gap-2 mt-4 text-[0.875rem] text-muted-foreground flex-wrap">
                <Clock className="h-3.5 w-3.5 text-[hsl(240_4%_66%)]" />
                <span>{module.duration_minutes} min</span>
                <span className="text-[hsl(240_4%_82%)]">·</span>
                <Award className="h-3.5 w-3.5 text-[hsl(240_4%_66%)]" />
                <span>{certInfo.name}</span>
                <span className="text-[hsl(240_4%_82%)]">·</span>
                <Layers className="h-3.5 w-3.5 text-[hsl(240_4%_66%)]" />
                <span>{completedSteps}/{totalSteps} complete</span>
              </div>

              {/* Slim progress bar */}
              <div className="mt-4 max-w-md">
                <div className="flex items-center justify-end mb-1">
                  <span className="text-[0.75rem] font-medium" style={{ color: certColor.accent }}>
                    {completedSteps}/{totalSteps} complete
                  </span>
                </div>
                <div className="h-1 rounded-full bg-[hsl(0_0%_94%)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(completedSteps / totalSteps) * 100}%`,
                      backgroundColor: certColor.accent,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Completion indicator */}
            <div className="flex items-center gap-2 shrink-0">
              {completedSteps === totalSteps && (
                <span className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium" style={{ color: '#16a34a' }}>
                  <CheckCircle className="h-5 w-5" />
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!showQuiz ? (
              <>
                {/* Video Section */}
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-[inherit] flex items-center justify-center">
                      <div className="text-center">
                        <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Video player placeholder</p>
                        <p className="text-sm text-muted-foreground">
                          (Video content would be loaded here)
                        </p>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-[0.8125rem] text-muted-foreground mb-4">{module.duration_minutes} minutes</p>
                      {!progress?.video_completed ? (
                        <Button onClick={markVideoComplete} className="w-full">
                          Mark as Complete & Take Quiz
                        </Button>
                      ) : (
                        <Button onClick={() => setShowQuiz(true)} className="w-full" variant="outline">
                          <CheckCircle className="mr-2 h-4 w-4" style={{ color: '#16a34a' }} />
                          Video Completed - Go to Quiz
                        </Button>
                      )}
                    </div>
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
                    Knowledge Check
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
                          quizPassed ? 'bg-[#f0fdf4]' : 'bg-destructive/20'
                        }`}>
                          {quizPassed ? (
                            <CheckCircle className="h-10 w-10" style={{ color: '#16a34a' }} />
                          ) : (
                            <HelpCircle className="h-10 w-10 text-destructive" />
                          )}
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-2">
                          {quizPassed ? 'Congratulations!' : 'Keep Learning!'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          You scored <span className="tabular-nums">{quizScore}%</span>. {quizPassed ? 'You passed!' : 'You need 70% to pass.'}
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
                <CardTitle className="text-[0.9375rem] font-bold">About This Module</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 p-0">
                <div className="flex items-center justify-between px-6 py-3 border-b border-[hsl(0_0%_96%)]">
                  <span className="text-[0.8125rem] text-muted-foreground">Duration</span>
                  <span className="text-[0.8125rem] font-semibold">{module.duration_minutes} min</span>
                </div>
                <div className="flex items-center justify-between px-6 py-3 border-b border-[hsl(0_0%_96%)]">
                  <span className="text-[0.8125rem] text-muted-foreground">Certificate</span>
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 text-[0.75rem] font-semibold border"
                    style={{
                      backgroundColor: certColor.bg,
                      color: certColor.accent,
                      borderColor: certColor.border,
                    }}
                  >
                    {certInfo.name}
                  </span>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-[0.8125rem] text-muted-foreground">Simulation</span>
                  {module.has_simulation ? (
                    <span className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-primary">
                      <Zap className="h-3 w-3" />
                      Included
                    </span>
                  ) : (
                    <span className="text-[0.8125rem] text-[hsl(240_4%_66%)]">None</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[0.9375rem] font-bold">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {progress?.video_completed ? (
                    <CheckCircle className="h-5 w-5" style={{ color: '#16a34a' }} />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2" />
                  )}
                  <span className="text-[0.875rem]">Watch Video</span>
                </div>
                <div className="flex items-center gap-3">
                  {quizPassed ? (
                    <CheckCircle className="h-5 w-5" style={{ color: '#16a34a' }} />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2" />
                  )}
                  <span className="text-[0.875rem]">Pass Quiz (70%+)</span>
                </div>
                {module.has_simulation && (
                  <div className="flex items-center gap-3">
                    {progress?.simulation_completed ? (
                      <CheckCircle className="h-5 w-5" style={{ color: '#16a34a' }} />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2" />
                    )}
                    <span className="text-[0.875rem]">Complete Simulation</span>
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

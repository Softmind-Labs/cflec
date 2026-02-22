import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  PlayCircle, 
  Lock,
  CheckCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';
import type { Module, UserProgress, LeaderboardEntry } from '@/types';
import { CERTIFICATE_INFO } from '@/types';

export default function Dashboard() {
  const { profile } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [modulesRes, progressRes, leaderboardRes] = await Promise.all([
        supabase.from('modules').select('*').order('module_number'),
        supabase.from('user_progress').select('*'),
        supabase.from('leaderboard').select('*').limit(5),
      ]);

      if (modulesRes.data) setModules(modulesRes.data as Module[]);
      if (progressRes.data) setProgress(progressRes.data as UserProgress[]);
      if (leaderboardRes.data) setLeaderboard(leaderboardRes.data as LeaderboardEntry[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getCompletedModules = () => {
    return progress.filter(p => 
      p.video_completed && p.quiz_passed && 
      (modules.find(m => m.id === p.module_id)?.has_simulation ? p.simulation_completed : true)
    ).length;
  };

  const getCurrentModule = () => {
    const completedIds = new Set(
      progress
        .filter(p => p.video_completed && p.quiz_passed)
        .map(p => p.module_id)
    );
    
    return modules.find(m => !completedIds.has(m.id)) || modules[0];
  };

  const getCertificateProgress = () => {
    const greenModules = modules.filter(m => m.certificate_level === 'green');
    const completedGreen = progress.filter(p => {
      const mod = modules.find(m => m.id === p.module_id);
      return mod?.certificate_level === 'green' && p.video_completed && p.quiz_passed;
    }).length;
    
    return {
      current: 'green' as const,
      completed: completedGreen,
      total: greenModules.length,
      percentage: greenModules.length > 0 ? (completedGreen / greenModules.length) * 100 : 0,
    };
  };

  const certProgress = getCertificateProgress();
  const currentModule = getCurrentModule();

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-full bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--cflp-gold)/0.05)]">
          <div className="container py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="grid md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-40 bg-muted rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--cflp-gold)/0.05)]">
        <div className="container py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.full_name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your financial literacy journey
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Modules Completed</CardDescription>
                <CardTitle className="text-3xl">{getCompletedModules()}/{modules.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(getCompletedModules() / modules.length) * 100} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Current Certificate</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-[hsl(var(--cflp-green))]" />
                  {CERTIFICATE_INFO[certProgress.current].name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={certProgress.percentage} className="h-2 bg-[hsl(var(--cflp-green)/0.2)]" />
                <p className="text-sm text-muted-foreground mt-2">
                  {certProgress.completed}/{certProgress.total} modules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Quiz Pass Rate</CardDescription>
                <CardTitle className="text-3xl">
                  {progress.length > 0 
                    ? Math.round((progress.filter(p => p.quiz_passed).length / progress.length) * 100)
                    : 0}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {progress.filter(p => p.quiz_passed).length} quizzes passed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Learning Streak</CardDescription>
                <CardTitle className="text-3xl">🔥 3 days</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep it going!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Module */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Continue Learning</Badge>
                    <span className="text-sm text-muted-foreground">
                      Module {currentModule?.module_number}
                    </span>
                  </div>
                  <CardTitle className="text-2xl mt-2">{currentModule?.title}</CardTitle>
                  <CardDescription>{currentModule?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      {currentModule?.duration_minutes} min
                    </span>
                    <Badge className={`certificate-${currentModule?.certificate_level}`}>
                      {currentModule?.certificate_level?.toUpperCase()}
                    </Badge>
                  </div>
                  <Link to={`/modules/${currentModule?.id}`}>
                    <Button className="gap-2">
                      Continue Learning
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Upcoming Modules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Upcoming Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modules.slice(0, 5).map((module, index) => {
                      const moduleProgress = progress.find(p => p.module_id === module.id);
                      const isCompleted = moduleProgress?.video_completed && moduleProgress?.quiz_passed;
                      const isLocked = index > 0 && !progress.find(p => p.module_id === modules[index - 1]?.id);

                      return (
                        <div 
                          key={module.id} 
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isLocked ? 'bg-muted/50 opacity-60' : 'bg-muted/30 hover:bg-muted/50'
                          } transition-colors`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-[hsl(var(--cflp-green))] text-white' 
                                : isLocked 
                                  ? 'bg-muted' 
                                  : 'bg-primary/10'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : isLocked ? (
                                <Lock className="h-5 w-5" />
                              ) : (
                                <span className="font-medium">{module.module_number}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{module.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {module.duration_minutes} min
                              </p>
                            </div>
                          </div>
                          {!isLocked && !isCompleted && (
                            <Link to={`/modules/${module.id}`}>
                              <Button size="sm" variant="ghost">
                                Start
                              </Button>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Link to="/modules" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      View All Modules
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trading Simulator Card */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Trading Simulator
                  </CardTitle>
                  <CardDescription>
                    Practice trading with $500 in virtual money
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/simulator">
                    <Button className="w-full" variant="outline">
                      Open Simulator
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Leaderboard Preview */}
              <Card className="border-2 border-[hsl(var(--cflp-gold)/0.3)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[hsl(var(--cflp-gold))]" />
                    Top Traders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => (
                        <div key={entry.user_id} className="flex items-center gap-3">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-[hsl(var(--cflp-gold))] text-white' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                            index === 2 ? 'bg-amber-600 text-white' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="flex-1 truncate">{entry.full_name}</span>
                          <span className="text-sm font-medium text-[hsl(var(--cflp-green))]">
                            ${Number(entry.total_value).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No traders yet. Be the first!
                    </p>
                  )}
                  <Link to="/simulator/leaderboard" className="block mt-4">
                    <Button variant="ghost" className="w-full" size="sm">
                      View Full Leaderboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Your Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(['green', 'white', 'gold', 'blue'] as const).map((level) => {
                      const info = CERTIFICATE_INFO[level];
                      const isEarned = false; // TODO: Check from certificates table
                      
                      return (
                        <div 
                          key={level}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            isEarned ? 'bg-muted/50' : 'opacity-50'
                          }`}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center certificate-${level}`}>
                            {isEarned ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{info.name}</p>
                            <p className="text-xs text-muted-foreground">{info.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link to="/certificates" className="block mt-4">
                    <Button variant="ghost" className="w-full" size="sm">
                      View All Certificates
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

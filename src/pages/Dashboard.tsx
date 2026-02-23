import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  ArrowRight,
  Target,
  Flame,
  Clock
} from 'lucide-react';
import type { Module, UserProgress, LeaderboardEntry } from '@/types';
import { CERTIFICATE_INFO } from '@/types';
import { CERT_COLORS } from '@/lib/cert-colors';

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
        supabase.rpc('get_leaderboard', { limit_count: 5 }),
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
        <div className="min-h-full bg-background">
          <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
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

  const quizPassRate = progress.length > 0
    ? Math.round((progress.filter(p => p.quiz_passed).length / progress.length) * 100)
    : 0;
  const quizzesPassed = progress.filter(p => p.quiz_passed).length;
  const completedCount = getCompletedModules();

  return (
    <MainLayout>
      <div className="min-h-full bg-background">
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-[2rem] text-[hsl(0_0%_4%)]">
              Welcome back, {profile?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your financial literacy journey
            </p>
            <div className="w-12 h-[3px] bg-primary rounded-full mt-3" />
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Card 1 — Modules Completed */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-[12px] bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="font-display font-bold text-[2rem] tabular-nums text-[hsl(0_0%_4%)] leading-none">
                  {completedCount}/{modules.length}
                </p>
                <p className="text-[0.8125rem] font-medium text-[hsl(240_4%_46%)] uppercase tracking-[0.06em] mt-2">
                  Modules Completed
                </p>
                <div className="mt-3 h-[3px] rounded-full bg-[hsl(0_0%_94%)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-400"
                    style={{ width: `${modules.length > 0 ? (completedCount / modules.length) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card 2 — Current Certificate */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: `${CERT_COLORS[certProgress.current].accent}1a` }}>
                    <Award className="h-5 w-5" style={{ color: CERT_COLORS[certProgress.current].accent }} />
                  </div>
                </div>
                <div className="mb-2">
                  <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[0.75rem] font-semibold border" style={{ backgroundColor: CERT_COLORS[certProgress.current].bg, color: CERT_COLORS[certProgress.current].accent, borderColor: CERT_COLORS[certProgress.current].border }}>
                    {certProgress.current.toUpperCase()}
                  </span>
                </div>
                <p className="text-[0.8125rem] text-muted-foreground tabular-nums">
                  {certProgress.completed}/{certProgress.total} modules
                </p>
                <p className="text-[0.8125rem] font-medium text-[hsl(240_4%_46%)] uppercase tracking-[0.06em] mt-2">
                  Current Certificate
                </p>
              </CardContent>
            </Card>

            {/* Card 3 — Quiz Pass Rate */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: 'rgba(217,119,6,0.1)' }}>
                    <Target className="h-5 w-5" style={{ color: '#d97706' }} />
                  </div>
                </div>
                <p className="font-display font-bold text-[2rem] tabular-nums text-[hsl(0_0%_4%)] leading-none">
                  {quizPassRate}%
                </p>
                <p className="text-[0.8125rem] text-muted-foreground mt-1">
                  {quizzesPassed} quizzes passed
                </p>
                <p className="text-[0.8125rem] font-medium text-[hsl(240_4%_46%)] uppercase tracking-[0.06em] mt-2">
                  Quiz Pass Rate
                </p>
              </CardContent>
            </Card>

            {/* Card 4 — Learning Streak */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}>
                    <Flame className="h-5 w-5" style={{ color: '#f97316' }} />
                  </div>
                </div>
                <p className="font-display font-bold text-[2rem] tabular-nums text-[hsl(0_0%_4%)] leading-none">
                  3
                </p>
                <p className="text-[0.8125rem] text-muted-foreground mt-1">
                  days · Keep it going!
                </p>
                <p className="text-[0.8125rem] font-medium text-[hsl(240_4%_46%)] uppercase tracking-[0.06em] mt-2">
                  Learning Streak
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Module — Continue Learning */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-primary rounded-[20px] p-8 text-white border-none shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center bg-white/15 text-white rounded-full px-3.5 py-1 text-xs font-medium">
                    Continue Learning
                  </span>
                  <span className="text-white/60 text-sm">
                    Module {currentModule?.module_number}
                  </span>
                </div>
                <h2 className="font-display font-semibold text-[1.5rem] text-white mt-4 tracking-[-0.02em]">
                  {currentModule?.title}
                </h2>
                <p className="text-white/70 text-[0.9375rem] mt-2 max-w-[480px]">
                  {currentModule?.description}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="flex items-center gap-1.5 text-white/60 text-[0.8125rem]">
                    <Clock className="h-3.5 w-3.5" />
                    {currentModule?.duration_minutes} min
                  </span>
                  <span className="inline-flex items-center bg-white/15 text-white rounded-full px-2.5 py-0.5 text-xs">
                    {currentModule?.certificate_level?.toUpperCase()}
                  </span>
                </div>
                <Link to={`/modules/${currentModule?.id}`} className="inline-block mt-6">
                  <button className="inline-flex items-center gap-2 bg-white text-primary rounded-[10px] h-[42px] px-6 font-semibold text-[0.875rem] hover:bg-white/90 transition-colors">
                    Continue Learning
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>

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
              <Card>
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
                    <Button className="w-full rounded-[10px]" variant="outline">
                      Open Simulator
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Leaderboard Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" style={{ color: '#d97706' }} />
                    Top Traders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => (
                        <div key={entry.user_id} className="flex items-center gap-3">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[0.75rem] font-bold ${
                            index === 0 ? 'bg-[hsl(51_92%_91%)] text-[hsl(46_97%_40%)]' :
                            'bg-[hsl(240_6%_96%)] text-[hsl(240_4%_36%)]'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="flex-1 truncate text-[0.875rem] font-medium">{entry.full_name}</span>
                          <span className="text-[0.875rem] font-semibold tabular-nums" style={{ color: '#16a34a' }}>
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
                      const isEarned = false;
                      
                      return (
                        <div 
                          key={level}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            isEarned ? 'bg-muted/50' : 'opacity-50'
                          }`}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: CERT_COLORS[level].accent, color: '#ffffff' }}>
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

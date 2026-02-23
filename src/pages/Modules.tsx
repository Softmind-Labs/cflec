import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  PlayCircle, 
  Lock,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  Zap,
  Flame
} from 'lucide-react';
import type { Module, UserProgress, CertificateLevel } from '@/types';
import { CERTIFICATE_INFO } from '@/types';

const certAccentColors: Record<CertificateLevel, string> = {
  green: '#16a34a',
  white: '#3b82f6',
  gold: '#d97706',
  blue: '#6366f1',
};

export default function Modules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CertificateLevel>('green');

  useEffect(() => {
    const fetchData = async () => {
      const [modulesRes, progressRes] = await Promise.all([
        supabase.from('modules').select('*').order('module_number'),
        supabase.from('user_progress').select('*'),
      ]);

      if (modulesRes.data) setModules(modulesRes.data as Module[]);
      if (progressRes.data) setProgress(progressRes.data as UserProgress[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const isModuleLocked = (module: Module) => {
    if (module.module_number === 1) return false;
    const prevModule = modules.find(m => m.module_number === module.module_number - 1);
    if (!prevModule) return false;
    const prevProgress = progress.find(p => p.module_id === prevModule.id);
    return !prevProgress?.video_completed || !prevProgress?.quiz_passed;
  };

  const isModuleCompleted = (module: Module) => {
    const moduleProgress = progress.find(p => p.module_id === module.id);
    if (!moduleProgress) return false;
    return moduleProgress.video_completed && 
           moduleProgress.quiz_passed && 
           (!module.has_simulation || moduleProgress.simulation_completed);
  };

  const getModuleProgress = (module: Module) => {
    const moduleProgress = progress.find(p => p.module_id === module.id);
    if (!moduleProgress) return 0;
    let steps = 0;
    let total = 2;
    if (moduleProgress.video_completed) steps++;
    if (moduleProgress.quiz_passed) steps++;
    if (module.has_simulation) {
      total = 3;
      if (moduleProgress.simulation_completed) steps++;
    }
    return (steps / total) * 100;
  };

  const getModulesByLevel = (level: CertificateLevel) => {
    return modules.filter(m => m.certificate_level === level);
  };

  const totalCompleted = modules.filter(m => isModuleCompleted(m)).length;
  const quizzesPassed = progress.filter(p => p.quiz_passed).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
        {/* Breadcrumbs */}
        <BreadcrumbNav
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Modules' },
          ]}
        />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-[2rem] text-[hsl(0_0%_4%)]">
            Learning Modules
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete modules to earn certificates and unlock new content
          </p>
          <div className="w-12 h-[3px] bg-primary rounded-full mt-3" />
        </div>

        {/* Stats Summary Bar */}
        <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-4 px-6 mb-8 flex flex-wrap items-center divide-x divide-[hsl(0_0%_94%)]">
          {[
            { icon: <BookOpen className="h-4 w-4 text-muted-foreground" />, value: modules.length, label: 'Total Modules' },
            { icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />, value: totalCompleted, label: 'Completed' },
            { icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />, value: quizzesPassed, label: 'Quizzes Passed' },
            { icon: <Flame className="h-4 w-4" style={{ color: '#f97316' }} />, value: '3 days', label: 'Streak' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5 px-5 first:pl-0 last:pr-0">
              {stat.icon}
              <span className="font-semibold text-[0.9375rem] tabular-nums text-[hsl(0_0%_4%)]">{stat.value}</span>
              <span className="text-[0.8125rem] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CertificateLevel)}>
          <TabsList className="mb-6">
            {(['green', 'white', 'gold', 'blue'] as const).map((level) => {
              const levelModules = getModulesByLevel(level);
              const completed = levelModules.filter(m => isModuleCompleted(m)).length;
              
              return (
                <TabsTrigger 
                  key={level} 
                  value={level}
                  className="gap-2"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: certAccentColors[level] }} />
                  {CERTIFICATE_INFO[level].name}
                  <Badge variant="secondary" className="ml-1 text-[0.75rem]">
                    {completed}/{levelModules.length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(['green', 'white', 'gold', 'blue'] as const).map((level) => {
            const accent = certAccentColors[level];
            const levelModules = getModulesByLevel(level);
            const completedCount = levelModules.filter(m => isModuleCompleted(m)).length;

            return (
              <TabsContent key={level} value={level}>
                {/* Section heading */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <span className="h-3 w-3 rounded-full mt-1.5" style={{ backgroundColor: accent }} />
                    <div>
                      <h2 className="text-[1.125rem] font-bold text-[hsl(0_0%_4%)]">{CERTIFICATE_INFO[level].name}</h2>
                      <p className="text-[0.875rem] text-muted-foreground">{CERTIFICATE_INFO[level].description}</p>
                    </div>
                  </div>
                  <span className="text-[0.8125rem] font-medium text-[hsl(240_4%_66%)] shrink-0">
                    {completedCount} of {levelModules.length} modules complete
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {levelModules.map((module) => {
                    const locked = isModuleLocked(module);
                    const completed = isModuleCompleted(module);
                    const progressPct = getModuleProgress(module);

                    return (
                      <Card 
                        key={module.id} 
                        className={`relative overflow-hidden ${locked ? 'opacity-60' : ''}`}
                      >
                        {/* Flat tinted header */}
                        <div
                          className="relative h-20 flex items-center justify-between px-4"
                          style={{ backgroundColor: `${accent}1f` }}
                        >
                          <span className="text-lg font-display font-bold" style={{ color: `${accent}99` }}>
                            {String(module.module_number).padStart(2, '0')}
                          </span>
                          {completed && (
                            <div className="h-8 w-8 rounded-full bg-white/60 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5" style={{ color: accent }} />
                            </div>
                          )}
                          {locked && (
                            <Lock className="h-4 w-4" style={{ color: 'rgba(0,0,0,0.2)' }} />
                          )}
                        </div>

                        <CardHeader className="pt-4 pb-2">
                          <div className="flex items-center gap-2 text-[0.75rem] text-[hsl(240_4%_66%)] mb-1">
                            <span>Module {module.module_number}</span>
                            {module.has_simulation && (
                              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold">
                                <Zap className="h-2.5 w-2.5" />
                                Simulation
                              </span>
                            )}
                          </div>
                          <CardTitle className="text-base font-bold">{module.title}</CardTitle>
                          <CardDescription className="line-clamp-2 text-[0.8125rem]">{module.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between mb-3">
                            <span className="flex items-center gap-1 text-[0.8125rem] text-[hsl(240_4%_66%)]">
                              <Clock className="h-3 w-3" />
                              {module.duration_minutes} min
                            </span>

                            {!locked && (
                              <Link to={`/modules/${module.id}`}>
                                <Button
                                  size="sm"
                                  variant={completed ? 'outline' : 'default'}
                                  className="rounded-lg h-[34px] px-4 text-[0.8125rem] font-semibold"
                                >
                                  {completed ? 'Review' : 'Start →'}
                                </Button>
                              </Link>
                            )}
                          </div>

                          <Progress value={progressPct} className="h-1.5" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </MainLayout>
  );
}

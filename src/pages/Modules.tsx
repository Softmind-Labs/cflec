import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { StatsBar } from '@/components/ui/stats-bar';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  PlayCircle, 
  Lock,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  Zap
} from 'lucide-react';
import type { Module, UserProgress, CertificateLevel } from '@/types';
import { CERTIFICATE_INFO } from '@/types';

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
    
    const hasSimulation = module.has_simulation;
    return moduleProgress.video_completed && 
           moduleProgress.quiz_passed && 
           (!hasSimulation || moduleProgress.simulation_completed);
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

  // Certificate level color map for gradient headers
  const levelColorMap: Record<CertificateLevel, string> = {
    green: 'from-[hsl(var(--cflp-green))] to-[hsl(var(--cflp-green)/0.7)]',
    white: 'from-gray-300 to-gray-200',
    gold: 'from-[hsl(var(--cflp-gold))] to-[hsl(var(--cflp-gold)/0.7)]',
    blue: 'from-[hsl(var(--cflp-blue))] to-[hsl(var(--cflp-blue)/0.7)]',
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
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
      <div className="container py-8">
        {/* Breadcrumbs */}
        <BreadcrumbNav
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Modules' },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-display flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Learning Modules
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete modules to earn certificates and unlock new content
          </p>
        </div>

        {/* Stats Summary Bar */}
        <StatsBar
          className="mb-8"
          items={[
            { label: 'Total Modules', value: modules.length, icon: <BookOpen className="h-4 w-4" /> },
            { label: 'Completed', value: totalCompleted, icon: <CheckCircle className="h-4 w-4" /> },
            { label: 'Quizzes Passed', value: quizzesPassed, icon: <BarChart3 className="h-4 w-4" /> },
            { label: 'Streak', value: '🔥 3 days', icon: <Zap className="h-4 w-4" /> },
          ]}
        />

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
                  <span className={`h-3 w-3 rounded-full certificate-${level}`} />
                  {CERTIFICATE_INFO[level].name}
                  <Badge variant="secondary" className="ml-1">
                    {completed}/{levelModules.length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(['green', 'white', 'gold', 'blue'] as const).map((level) => (
            <TabsContent key={level} value={level}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{CERTIFICATE_INFO[level].name}</h2>
                <p className="text-muted-foreground">{CERTIFICATE_INFO[level].description}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getModulesByLevel(level).map((module) => {
                  const locked = isModuleLocked(module);
                  const completed = isModuleCompleted(module);
                  const progressPct = getModuleProgress(module);

                  return (
                    <Card 
                      key={module.id} 
                      className={`relative overflow-hidden transition-all ${
                        locked ? 'opacity-60' : 'hover:shadow-lg'
                      }`}
                    >
                      {/* Gradient Header with Module Number */}
                      <div className={`relative h-24 bg-gradient-to-br ${levelColorMap[level]} flex items-center justify-between px-6`}>
                        <span className="text-3xl font-display font-bold text-white/90 drop-shadow">
                          {String(module.module_number).padStart(2, '0')}
                        </span>
                        {completed && (
                          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                        )}
                        {locked && (
                          <div className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                            <Lock className="h-5 w-5 text-white/80" />
                          </div>
                        )}
                      </div>

                      <CardHeader className="pt-4 pb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <span>Module {module.module_number}</span>
                          {module.has_simulation && (
                            <Badge variant="outline" className="text-xs">
                              + Simulation
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {module.duration_minutes} min
                            </span>
                          </div>

                          {!locked && (
                            <Link to={`/modules/${module.id}`}>
                              <Button size="sm" variant={completed ? 'outline' : 'default'}>
                                <PlayCircle className="h-4 w-4 mr-1" />
                                {completed ? 'Review' : 'Start'}
                              </Button>
                            </Link>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <Progress value={progressPct} className="h-1.5" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
}

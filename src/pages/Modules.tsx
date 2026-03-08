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
  Lock,
  CheckCircle,
  Clock,
  BarChart3,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import type { Module, UserProgress, Stage, Band } from '@/types';

const STAGE_COLORS: Record<number, string> = {
  1: '#22c55e',
  2: '#9CA3AF',
  3: '#d4a017',
  4: '#1e3a5f',
  5: '#000000',
  99: '#CE1126',
};

export default function Modules() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [bands, setBands] = useState<Band[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stage-1');

  useEffect(() => {
    const fetchData = async () => {
      const [stagesRes, bandsRes, modulesRes, progressRes] = await Promise.all([
        supabase.from('stages').select('*').order('stage_number'),
        supabase.from('bands').select('*').order('sort_order'),
        supabase.from('modules').select('*').order('sort_order'),
        supabase.from('user_progress').select('*'),
      ]);

      if (stagesRes.data) setStages(stagesRes.data as unknown as Stage[]);
      if (bandsRes.data) setBands(bandsRes.data as unknown as Band[]);
      if (modulesRes.data) setModules(modulesRes.data as unknown as Module[]);
      if (progressRes.data) setProgress(progressRes.data as UserProgress[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Non-module-99 modules
  const regularModules = modules.filter(m => m.module_number !== 99);
  const module99 = modules.find(m => m.module_number === 99);

  const getModulesByStage = (stageId: number) =>
    regularModules.filter(m => m.stage_id === stageId);

  const getBandsByStage = (stageId: number) =>
    bands.filter(b => b.stage_id === stageId);

  const isModuleCompleted = (module: Module) => {
    const p = progress.find(pr => pr.module_id === module.id);
    if (!p) return false;
    return p.video_completed && p.quiz_passed &&
      (!module.has_simulation || p.simulation_completed);
  };

  const isModuleLocked = (module: Module) => {
    if (module.is_compulsory) return false;
    // First module in each stage is unlocked
    const stageModules = regularModules
      .filter(m => m.stage_id === module.stage_id)
      .sort((a, b) => a.sort_order - b.sort_order);
    if (stageModules.length === 0) return false;
    if (stageModules[0].id === module.id) return false;
    const idx = stageModules.findIndex(m => m.id === module.id);
    if (idx <= 0) return false;
    return !isModuleCompleted(stageModules[idx - 1]);
  };

  const getModuleProgress = (module: Module) => {
    const p = progress.find(pr => pr.module_id === module.id);
    if (!p) return 0;
    let steps = 0;
    let total = 2;
    if (p.video_completed) steps++;
    if (p.quiz_passed) steps++;
    if (module.has_simulation) {
      total = 3;
      if (p.simulation_completed) steps++;
    }
    return (steps / total) * 100;
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

  const renderModuleCard = (module: Module, accent: string) => {
    const locked = isModuleLocked(module);
    const completed = isModuleCompleted(module);
    const progressPct = getModuleProgress(module);

    return (
      <Card
        key={module.id}
        className={`relative overflow-hidden ${locked ? 'opacity-60' : ''}`}
      >
        {/* Tinted header */}
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
          <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground mb-1">
            <span>Module {module.module_number}</span>
            {module.is_compulsory && (
              <span className="inline-flex items-center gap-1 bg-destructive/10 text-destructive rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold">
                <AlertTriangle className="h-2.5 w-2.5" />
                Compulsory
              </span>
            )}
          </div>
          <CardTitle className="text-base font-bold">{module.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-[0.8125rem]">
            {module.learning_objective || module.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1 text-[0.8125rem] text-muted-foreground">
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
  };

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
        <BreadcrumbNav
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Modules' },
          ]}
        />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-[2rem] text-foreground">
            Learning Modules
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete modules to earn certificates and unlock new content
          </p>
          <div className="w-12 h-[3px] bg-primary rounded-full mt-3" />
        </div>

        {/* Stats Summary Bar */}
        <div className="bg-card rounded-[12px] border border-border p-4 px-6 mb-8 flex flex-wrap items-center divide-x divide-border">
          {[
            { icon: <BookOpen className="h-4 w-4 text-muted-foreground" />, value: modules.length, label: 'Total Modules' },
            { icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />, value: totalCompleted, label: 'Completed' },
            { icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />, value: quizzesPassed, label: 'Quizzes Passed' },
            { icon: <Flame className="h-4 w-4 text-orange-500" />, value: '3 days', label: 'Streak' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5 px-5 first:pl-0 last:pr-0">
              {stat.icon}
              <span className="font-semibold text-[0.9375rem] tabular-nums text-foreground">{stat.value}</span>
              <span className="text-[0.8125rem] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            {stages.map((stage) => {
              const stageModules = getModulesByStage(stage.id);
              const completed = stageModules.filter(m => isModuleCompleted(m)).length;
              const color = STAGE_COLORS[stage.stage_number] || '#888';

              return (
                <TabsTrigger
                  key={stage.id}
                  value={`stage-${stage.stage_number}`}
                  className="gap-2"
                >
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                   <span className="hidden sm:inline">{stage.title} Certificate</span>
                   <span className="sm:hidden">{stage.title}</span>
                  <Badge variant="secondary" className="ml-1 text-[0.75rem]">
                    {completed}/{stageModules.length}
                  </Badge>
                </TabsTrigger>
              );
            })}

            {/* Module 99 tab */}
            {module99 && (
              <TabsTrigger value="module-99" className="gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: STAGE_COLORS[99] }} />
                Module 99
                <Badge variant="secondary" className="ml-1 text-[0.75rem]">
                  {isModuleCompleted(module99) ? '1' : '0'}/1
                </Badge>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Stage tabs */}
          {stages.map((stage) => {
            const stageModules = getModulesByStage(stage.id);
            const completedCount = stageModules.filter(m => isModuleCompleted(m)).length;
            const accent = STAGE_COLORS[stage.stage_number] || '#888';
            const stageBands = getBandsByStage(stage.id);
            const hasBands = stageBands.length > 0;

            return (
              <TabsContent key={stage.id} value={`stage-${stage.stage_number}`}>
                {/* Section heading */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <span className="h-3 w-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accent }} />
                    <div>
                      <h2 className="text-[1.125rem] font-bold text-foreground">
                        {stage.title} Certificate
                      </h2>
                      <p className="text-[0.875rem] text-muted-foreground">{stage.certificate_name}</p>
                    </div>
                  </div>
                  <span className="text-[0.8125rem] font-medium text-muted-foreground shrink-0">
                    {completedCount} of {stageModules.length} modules complete
                  </span>
                </div>

                {hasBands ? (
                  // Stages 1-3: grouped by bands
                  <div className="space-y-8">
                    {stageBands.map((band) => {
                      const bandModules = stageModules
                        .filter(m => m.band_id === band.id)
                        .sort((a, b) => a.sort_order - b.sort_order);
                      if (bandModules.length === 0) return null;

                      return (
                        <div key={band.id}>
                          <h3 className="text-[0.9375rem] font-semibold text-foreground mb-4 pl-1">
                            {band.label}
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bandModules.map(m => renderModuleCard(m, accent))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Stages 4-5: flat grid
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stageModules
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map(m => renderModuleCard(m, accent))}
                  </div>
                )}
              </TabsContent>
            );
          })}

          {/* Module 99 tab */}
          {module99 && (
            <TabsContent value="module-99">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <span className="h-3 w-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: STAGE_COLORS[99] }} />
                  <div>
                    <h2 className="text-[1.125rem] font-bold text-foreground">
                      Module 99: Financial Citizenship
                    </h2>
                    <p className="text-[0.875rem] text-muted-foreground">
                      Required at every level — Compulsory for all learners
                    </p>
                  </div>
                </div>
                <span className="text-[0.8125rem] font-medium text-muted-foreground shrink-0">
                  {isModuleCompleted(module99) ? '1' : '0'} of 1 module complete
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderModuleCard(module99, STAGE_COLORS[99])}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
}

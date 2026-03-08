import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Award, Lock, CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stage {
  id: number;
  stage_number: number;
  title: string;
  certificate_name: string;
  color_primary: string | null;
  total_modules: number;
}

interface StageProgress {
  stage: Stage;
  completed: number;
  total: number;
  percentage: number;
  status: 'completed' | 'in_progress' | 'not_started' | 'locked';
}

const COLOR_FALLBACKS: Record<number, string> = {
  1: '#22c55e',
  2: '#14b8a6',
  3: '#1d4ed8',
  4: '#1e3a5f',
  5: '#000000',
};

export default function Certificates() {
  const { user } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);
  const [moduleCounts, setModuleCounts] = useState<Record<number, number>>({});
  const [completedCounts, setCompletedCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [stagesRes, modulesRes, progressRes] = await Promise.all([
        supabase
          .from('stages')
          .select('id, stage_number, title, certificate_name, color_primary, total_modules')
          .gte('stage_number', 1)
          .lte('stage_number', 5)
          .order('stage_number'),
        supabase
          .from('modules')
          .select('id, stage_id, module_number')
          .neq('module_number', 99),
        supabase
          .from('user_progress')
          .select('module_id, video_completed, quiz_passed'),
      ]);

      if (stagesRes.data) setStages(stagesRes.data);

      // Count modules per stage
      const counts: Record<number, number> = {};
      const moduleStageMap: Record<string, number> = {};
      if (modulesRes.data) {
        for (const m of modulesRes.data) {
          if (m.stage_id) {
            counts[m.stage_id] = (counts[m.stage_id] || 0) + 1;
            moduleStageMap[m.id] = m.stage_id;
          }
        }
      }
      setModuleCounts(counts);

      // Count completed modules per stage
      const completed: Record<number, number> = {};
      if (progressRes.data) {
        for (const p of progressRes.data) {
          if (p.video_completed && p.quiz_passed) {
            const stageId = moduleStageMap[p.module_id];
            if (stageId) {
              completed[stageId] = (completed[stageId] || 0) + 1;
            }
          }
        }
      }
      setCompletedCounts(completed);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const stageProgress: StageProgress[] = useMemo(() => {
    return stages.map((stage, index) => {
      const total = moduleCounts[stage.id] || stage.total_modules;
      const completed = completedCounts[stage.id] || 0;
      const percentage = total > 0 ? (completed / total) * 100 : 0;

      // Lock logic: Stage 1 always unlocked, others need previous stage complete
      let isLocked = false;
      if (index > 0) {
        const prevStage = stages[index - 1];
        const prevTotal = moduleCounts[prevStage.id] || prevStage.total_modules;
        const prevCompleted = completedCounts[prevStage.id] || 0;
        isLocked = prevCompleted < prevTotal;
      }

      let status: StageProgress['status'];
      if (isLocked) status = 'locked';
      else if (completed >= total && total > 0) status = 'completed';
      else if (completed > 0) status = 'in_progress';
      else status = 'not_started';

      return { stage, completed, total, percentage, status };
    });
  }, [stages, moduleCounts, completedCounts]);

  const completedStageCount = stageProgress.filter(s => s.status === 'completed').length;

  const getColor = (stage: Stage) => stage.color_primary || COLOR_FALLBACKS[stage.stage_number] || '#6b7280';

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 w-48 bg-muted rounded-lg shrink-0" />
              ))}
            </div>
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-muted rounded-lg" />
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-[2rem] text-foreground">
            Your Learning Journey
          </h1>
          <p className="text-muted-foreground mt-1">
            Progress through 5 stages and earn recognized certificates
          </p>
          <div className="w-12 h-[3px] bg-primary rounded-full mt-3" />
        </div>

        {/* Summary Cards Row */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 -mx-1 px-1">
          {stageProgress.map(({ stage, completed, total, percentage, status }) => {
            const color = getColor(stage);
            const isLocked = status === 'locked';
            return (
              <Card
                key={stage.id}
                className={cn('shrink-0 w-[180px]', isLocked && 'opacity-50')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {isLocked ? (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    <span className="text-[0.75rem] font-medium text-muted-foreground truncate">
                      Stage {stage.stage_number}
                    </span>
                  </div>
                  <p className="font-display font-bold text-[1.125rem] tabular-nums text-foreground">
                    {completed}/{total}
                  </p>
                  <div className="mt-2 h-[3px] rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Vertical Journey Timeline */}
        <div className="relative">
          {stageProgress.map((sp, index) => {
            const { stage, completed, total, percentage, status } = sp;
            const color = getColor(stage);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress';
            const isLast = index === stageProgress.length - 1;

            // Find current active (first non-completed unlocked)
            const isActive = status === 'in_progress' || (status === 'not_started' && index === stageProgress.findIndex(s => s.status !== 'completed'));

            return (
              <div key={stage.id} className="relative flex gap-4 md:gap-6 pb-8 last:pb-0">
                {/* Timeline track */}
                <div className="flex flex-col items-center shrink-0">
                  {/* Node circle */}
                  <div
                    className={cn(
                      'relative z-10 h-11 w-11 rounded-full flex items-center justify-center border-2 shrink-0 transition-all',
                      isActive && 'shadow-[0_0_0_4px_rgba(59,130,246,0.15)]'
                    )}
                    style={{
                      borderColor: isLocked ? 'hsl(var(--border))' : color,
                      backgroundColor: isCompleted
                        ? color
                        : isLocked
                          ? 'hsl(var(--muted))'
                          : 'hsl(var(--card))',
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : isLocked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <span
                        className="text-[0.875rem] font-bold"
                        style={{ color }}
                      >
                        {stage.stage_number}
                      </span>
                    )}
                    {/* Pulse for active */}
                    {isActive && !isCompleted && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-20"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </div>
                  {/* Connecting line */}
                  {!isLast && (
                    <div
                      className={cn('w-0.5 flex-1 min-h-[2rem]')}
                      style={{
                        backgroundColor: isCompleted ? color : 'hsl(var(--border))',
                        ...(isLocked ? { backgroundImage: 'repeating-linear-gradient(to bottom, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 8px)', backgroundColor: 'transparent' } : {}),
                      }}
                    />
                  )}
                </div>

                {/* Milestone Card */}
                <Card
                  className={cn(
                    'flex-1 mb-2',
                    isLocked && 'opacity-60'
                  )}
                >
                  <CardContent className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className="h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: isLocked ? 'hsl(var(--muted))' : `${color}1a`,
                          }}
                        >
                          {isCompleted ? (
                            <Award className="h-5 w-5" style={{ color }} />
                          ) : isLocked ? (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Award className="h-5 w-5" style={{ color }} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3
                            className="font-display font-semibold text-[1.125rem] leading-snug"
                            style={{ color: isLocked ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))' }}
                          >
                            {stage.certificate_name}
                          </h3>
                          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">
                            Stage {stage.stage_number}: {stage.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status badge */}
                        {isCompleted && (
                          <>
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold bg-[hsl(142_76%_96%)] text-[hsl(142_76%_36%)]">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </span>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Download className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </>
                        )}
                        {isInProgress && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold bg-[hsl(217_91%_96%)] text-[hsl(217_91%_60%)]">
                            In Progress
                          </span>
                        )}
                        {status === 'not_started' && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold bg-muted text-muted-foreground">
                            Not Started
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold bg-muted text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            Locked
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress section (only for unlocked stages) */}
                    {!isLocked && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-[0.8125rem]">
                          <span className="font-medium text-muted-foreground">Progress</span>
                          <span className="font-medium tabular-nums text-foreground">
                            {completed}/{total} modules
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Locked message */}
                    {isLocked && index > 0 && (
                      <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                        Complete Stage {stages[index - 1].stage_number} to unlock
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Motivational Footer */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground text-[0.9375rem]">
            {completedStageCount === 0 && (
              <>Start your journey — complete Stage 1 to earn your first certificate! 🚀</>
            )}
            {completedStageCount > 0 && completedStageCount < 5 && (
              <>You've earned {completedStageCount} of 5 certificates. Keep going! 💪</>
            )}
            {completedStageCount === 5 && (
              <>Congratulations! You've completed the entire Financial Literacy Pathway! 🎓</>
            )}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

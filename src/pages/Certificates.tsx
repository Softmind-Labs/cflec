import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Award, Lock, CheckCircle2, Download } from 'lucide-react';
import type { Certificate, Module, UserProgress, CertificateLevel } from '@/types';
import { CERTIFICATE_INFO, CERTIFICATE_REQUIREMENTS } from '@/types';

import { CERT_COLORS } from '@/lib/cert-colors';

const certAccentColors = {
  green: CERT_COLORS.green.accent,
  white: CERT_COLORS.white.accent,
  gold: CERT_COLORS.gold.accent,
  blue: CERT_COLORS.blue.accent,
} as const;

export default function Certificates() {
  const { profile } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [certsRes, modulesRes, progressRes] = await Promise.all([
        supabase.from('certificates').select('*'),
        supabase.from('modules').select('*'),
        supabase.from('user_progress').select('*'),
      ]);

      if (certsRes.data) setCertificates(certsRes.data as Certificate[]);
      if (modulesRes.data) setModules(modulesRes.data as Module[]);
      if (progressRes.data) setProgress(progressRes.data as UserProgress[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getCertificateProgress = (level: CertificateLevel) => {
    const levelModules = modules.filter(m => m.certificate_level === level);
    const completedModules = levelModules.filter(module => {
      const moduleProgress = progress.find(p => p.module_id === module.id);
      return moduleProgress?.video_completed && moduleProgress?.quiz_passed;
    });

    return {
      completed: completedModules.length,
      total: levelModules.length,
      percentage: levelModules.length > 0 ? (completedModules.length / levelModules.length) * 100 : 0,
    };
  };

  const isCertificateEarned = (level: CertificateLevel) => {
    return certificates.some(c => c.certificate_level === level);
  };

  const isCertificateAvailable = (level: CertificateLevel) => {
    const requirements = CERTIFICATE_REQUIREMENTS[level];
    return requirements.requiredFor.includes(profile?.account_type || 'adult');
  };

  // Determine current active certificate (first non-earned available)
  const currentLevel = (['green', 'white', 'gold', 'blue'] as const).find(
    level => isCertificateAvailable(level) && !isCertificateEarned(level)
  ) || 'green';

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-muted rounded-lg" />
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-[2rem] text-[hsl(0_0%_4%)]">
            Your Certificates
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and earn certificates as you master each level
          </p>
          <div className="w-12 h-[3px] bg-primary rounded-full mt-3" />
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {(['green', 'white', 'gold', 'blue'] as const).map((level) => {
            const prog = getCertificateProgress(level);
            const earned = isCertificateEarned(level);
            const available = isCertificateAvailable(level);
            const accent = certAccentColors[level];
            const isCurrent = level === currentLevel;

            return (
              <Card
                key={level}
                className={!available ? 'opacity-50' : ''}
              style={isCurrent && available ? {
                  backgroundColor: `${accent}0a`,
                } : undefined}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
                    <span className="text-[0.8125rem] font-medium text-muted-foreground">
                      {CERTIFICATE_INFO[level].name}
                    </span>
                  </div>
                  <p className="font-display font-bold text-[1.25rem] tabular-nums text-[hsl(0_0%_4%)]">
                    {earned ? (
                      <span className="flex items-center gap-2" style={{ color: '#16a34a' }}>
                        <CheckCircle2 className="h-5 w-5" />
                        Earned!
                      </span>
                    ) : (
                      `${prog.completed}/${prog.total}`
                    )}
                  </p>
                  <div className="mt-3 h-[3px] rounded-full bg-[hsl(0_0%_96%)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-400"
                      style={{ width: `${prog.percentage}%`, backgroundColor: accent }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Certificate Detail Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {(['green', 'white', 'gold', 'blue'] as const).map((level) => {
            const info = CERTIFICATE_INFO[level];
            const prog = getCertificateProgress(level);
            const earned = isCertificateEarned(level);
            const available = isCertificateAvailable(level);
            const certificate = certificates.find(c => c.certificate_level === level);
            const accent = certAccentColors[level];
            const isLocked = !available;

            const statusBadge = earned ? (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <CheckCircle2 className="h-3 w-3" />
                Earned
              </span>
            ) : isLocked ? (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold bg-[hsl(240_6%_96%)] text-[hsl(240_4%_66%)]">
                <Lock className="h-3 w-3" />
                Locked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold" style={{ backgroundColor: `${accent}14`, color: accent }}>
                In Progress
              </span>
            );

            return (
              <Card
                key={level}
                className="relative overflow-hidden"
                style={{
                  opacity: isLocked ? 0.65 : 1,
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="h-11 w-11 rounded-[12px] flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isLocked ? 'hsl(240 6% 96%)' : `${accent}1f`,
                        }}
                      >
                        {earned ? (
                          <CheckCircle2 className="h-[22px] w-[22px]" style={{ color: '#16a34a' }} />
                        ) : isLocked ? (
                          <Lock className="h-[22px] w-[22px]" style={{ color: 'hsl(240 4% 66%)' }} />
                        ) : (
                          <Award className="h-[22px] w-[22px]" style={{ color: accent }} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-[1.25rem]" style={{ color: isLocked ? 'hsl(240 4% 66%)' : accent }}>
                          {info.name}
                        </h3>
                        <p className="text-[0.875rem] text-muted-foreground mt-0.5">{info.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {statusBadge}
                      {earned && (
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {isLocked ? (
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        This certificate is not available for {profile?.account_type?.replace('_', ' ')} accounts
                      </p>
                    </div>
                  ) : earned ? (
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#f0fdf4' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold" style={{ color: '#16a34a' }}>Certificate Earned!</p>
                          <p className="text-sm text-muted-foreground">
                            Certificate #{certificate?.certificate_number}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {certificate?.earned_at && new Date(certificate.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[0.8125rem]">
                        <span className="font-medium text-muted-foreground">Progress</span>
                        <span className="font-medium tabular-nums">{prog.completed}/{prog.total} modules</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[hsl(240_6%_96%)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-400"
                          style={{ width: `${prog.percentage}%`, backgroundColor: accent }}
                        />
                      </div>
                      <p className="text-[0.875rem] text-muted-foreground leading-relaxed">
                        Complete all modules and pass the quizzes to earn this certificate.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

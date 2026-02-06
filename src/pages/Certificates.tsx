import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Award, Lock, CheckCircle, Download } from 'lucide-react';
import type { Certificate, Module, UserProgress, CertificateLevel } from '@/types';
import { CERTIFICATE_INFO, CERTIFICATE_REQUIREMENTS } from '@/types';

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
    const requirements = CERTIFICATE_REQUIREMENTS[level];
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

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
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
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8" />
            Your Certificates
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and earn certificates as you master each level
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {(['green', 'white', 'gold', 'blue'] as const).map((level) => {
            const prog = getCertificateProgress(level);
            const earned = isCertificateEarned(level);
            const available = isCertificateAvailable(level);

            return (
              <Card key={level} className={!available ? 'opacity-50' : ''}>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full certificate-${level}`} />
                    {CERTIFICATE_INFO[level].name}
                  </CardDescription>
                  <CardTitle>
                    {earned ? (
                      <span className="flex items-center gap-2 text-cflp-green">
                        <CheckCircle className="h-5 w-5" />
                        Earned!
                      </span>
                    ) : (
                      `${prog.completed}/${prog.total}`
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={prog.percentage} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Certificate Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {(['green', 'white', 'gold', 'blue'] as const).map((level) => {
            const info = CERTIFICATE_INFO[level];
            const prog = getCertificateProgress(level);
            const earned = isCertificateEarned(level);
            const available = isCertificateAvailable(level);
            const certificate = certificates.find(c => c.certificate_level === level);

            return (
              <Card 
                key={level} 
                className={`relative overflow-hidden ${!available ? 'opacity-60' : ''}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 certificate-${level}`} />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center certificate-${level}`}>
                        {earned ? (
                          <CheckCircle className="h-8 w-8" />
                        ) : available ? (
                          <Award className="h-8 w-8" />
                        ) : (
                          <Lock className="h-8 w-8" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{info.name}</CardTitle>
                        <CardDescription>{info.description}</CardDescription>
                      </div>
                    </div>
                    {earned && (
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Download className="h-5 w-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {!available ? (
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        This certificate is not available for {profile?.account_type?.replace('_', ' ')} accounts
                      </p>
                    </div>
                  ) : earned ? (
                    <div className="bg-cflp-green/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-cflp-green">Certificate Earned!</p>
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{prog.completed}/{prog.total} modules</span>
                      </div>
                      <Progress value={prog.percentage} className="h-3" />
                      <p className="text-sm text-muted-foreground">
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

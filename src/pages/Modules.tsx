import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  PlayCircle, 
  Lock,
  CheckCircle,
  Clock
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

  const getModulesByLevel = (level: CertificateLevel) => {
    return modules.filter(m => m.certificate_level === level);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Learning Modules
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete modules to earn certificates and unlock new content
          </p>
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

                  return (
                    <Card 
                      key={module.id} 
                      className={`relative overflow-hidden transition-all ${
                        locked ? 'opacity-60' : 'hover:shadow-lg'
                      }`}
                    >
                      <div className={`absolute top-0 left-0 right-0 h-1 certificate-${level}`} />
                      
                      {completed && (
                        <div className="absolute top-3 right-3">
                          <div className="h-8 w-8 rounded-full bg-cflp-green flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}

                      {locked && (
                        <div className="absolute top-3 right-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      )}

                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>Module {module.module_number}</span>
                          {module.has_simulation && (
                            <Badge variant="outline" className="text-xs">
                              + Simulation
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between">
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

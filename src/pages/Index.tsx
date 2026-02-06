import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Users, 
  PlayCircle, 
  CheckCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { APP_FULL_NAME } from '@/lib/constants';

export default function Index() {
  const features = [
    {
      icon: GraduationCap,
      title: 'Structured Learning',
      description: 'Progress through 27 expertly crafted modules covering everything from basic budgeting to advanced wealth management.',
    },
    {
      icon: Award,
      title: 'Earn Certificates',
      description: 'Achieve Green, White, Gold, and Blue certifications as you master each level of financial literacy.',
    },
    {
      icon: TrendingUp,
      title: 'Stock Simulator',
      description: 'Practice trading with $500 in virtual money. Learn to buy, sell, and build a portfolio risk-free.',
    },
    {
      icon: Users,
      title: 'Compete & Learn',
      description: 'Join the leaderboard, compete with other learners, and track your investment performance.',
    },
  ];

  const certificates = [
    { level: 'Green', modules: '1-10', color: 'bg-cflp-green', description: 'Financial Fundamentals' },
    { level: 'White', modules: '11-20', color: 'bg-cflp-white border border-gray-300', description: 'Investment Basics' },
    { level: 'Gold', modules: '21-26', color: 'bg-cflp-gold', description: 'Advanced Strategies' },
    { level: 'Blue', modules: '99', color: 'bg-cflp-blue', description: 'Wealth Management' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CFLP</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cflp-gold/10" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              Trusted by 10,000+ learners
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Master Your{' '}
              <span className="text-primary">Financial Future</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {APP_FULL_NAME} - Your journey to financial literacy starts here. 
              Learn, practice, earn certificates, and compete with others in our 
              risk-free trading simulator.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Start Learning Free
                </Button>
              </Link>
              <Link to="/kids">
                <Button size="lg" variant="outline" className="gap-2 border-kids-primary text-kids-primary hover:bg-kids-primary hover:text-kids-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                  Kids Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything You Need to Succeed</h2>
            <p className="mt-4 text-muted-foreground">
              Comprehensive financial education designed for all ages and skill levels
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Levels */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Earn Recognized Certificates</h2>
            <p className="mt-4 text-muted-foreground">
              Progress through four levels of mastery and earn certificates to showcase your skills
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.level} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 ${cert.color}`} />
                <CardHeader className="pt-6">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {cert.level} Certificate
                  </CardTitle>
                  <CardDescription>{cert.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Modules {cert.modules}
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-cflp-green" />
                      Video Lessons
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-cflp-green" />
                      Quizzes
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-cflp-green" />
                      Practical Simulations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-kids-primary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Choose Your Learning Path</h2>
            <p className="mt-4 text-muted-foreground">
              Age-appropriate content designed for every learner
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer group">
              <Link to="/auth">
                <CardHeader>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Adults & Teens</CardTitle>
                  <CardDescription>High Schoolers (13-17) & Adults (18+)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cflp-green" />
                      Full curriculum access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cflp-green" />
                      Stock trading simulator
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cflp-green" />
                      All 4 certificate levels
                    </li>
                  </ul>
                  <Button className="w-full group-hover:bg-primary/90">
                    Enter Adult Portal
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="border-2 hover:border-kids-primary transition-colors cursor-pointer group">
              <Link to="/kids">
                <CardHeader>
                  <div className="h-16 w-16 rounded-full bg-kids-primary/10 flex items-center justify-center mb-4 group-hover:bg-kids-primary/20 transition-colors">
                    <Sparkles className="h-8 w-8 text-kids-primary" />
                  </div>
                  <CardTitle className="text-2xl">Kids Zone</CardTitle>
                  <CardDescription>Young Learners (6-12)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-kids-primary" />
                      Fun, interactive lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-kids-primary" />
                      Games & rewards
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-kids-primary" />
                      Green certificate path
                    </li>
                  </ul>
                  <Button className="w-full bg-kids-primary hover:bg-kids-primary/90 text-kids-primary-foreground">
                    Enter Kids Zone
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold">CFLP</span>
              <span className="text-muted-foreground">© 2024</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground">About</Link>
              <Link to="#" className="hover:text-foreground">Contact</Link>
              <Link to="#" className="hover:text-foreground">Terms</Link>
              <Link to="#" className="hover:text-foreground">Privacy</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

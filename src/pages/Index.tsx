import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Award, 
  PlayCircle, 
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { APP_FULL_NAME } from '@/lib/constants';
import cflecLogo from '@/assets/cflec-logo.png';
import onlineLearningImg from '@/assets/features/online-learning.jpg';
import certificatesImg from '@/assets/features/certificates.jpg';
import tradingSimulatorImg from '@/assets/features/trading-simulator.jpg';
import aiAssistedImg from '@/assets/features/ai-assisted.jpg';

export default function Index() {
  const features = [
    {
      image: onlineLearningImg,
      title: 'Structured Learning',
      description: 'Progress through 27 expertly crafted modules',
      cta: 'Start Learning',
      link: '/auth',
    },
    {
      image: certificatesImg,
      title: 'Earn Certificates',
      description: 'Achieve Green, White, Gold, and Blue certifications',
      cta: 'View Certificates',
      link: '/auth',
    },
    {
      image: tradingSimulatorImg,
      title: 'Stock Simulator',
      description: 'Practice trading with $500 in virtual money',
      cta: 'Try Simulator',
      link: '/auth',
    },
    {
      image: aiAssistedImg,
      title: 'AI-Powered Support',
      description: 'Get personalized guidance and instant answers',
      cta: 'Learn More',
      link: '/auth',
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
      {/* Transparent Header for Hero */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={cflecLogo} alt="CFLEC Logo" className="h-10 w-auto" />
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Login</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-white text-foreground hover:bg-white/90">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/money.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        />
        
        {/* Hero Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Sparkles className="mr-1 h-3 w-3" />
            Trusted by 10,000+ learners
          </Badge>
          
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Master Your
            <br />
            <span className="text-cflp-gold">Financial Future</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg text-white/90 md:text-xl" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
            {APP_FULL_NAME} — Your journey to financial literacy starts here. 
            Learn, practice, earn certificates, and compete with others in our 
            risk-free trading simulator.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2 bg-white text-foreground hover:bg-white/90 text-base px-8">
                <PlayCircle className="h-5 w-5" />
                Start Learning Free
              </Button>
            </Link>
            <Link to="/kids">
              <Button size="lg" variant="outline" className="gap-2 border-kids-primary bg-kids-primary/10 text-white hover:bg-kids-primary hover:text-kids-primary-foreground text-base px-8">
                <Sparkles className="h-5 w-5" />
                Kids Portal
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">Everything You Need to Succeed</h2>
            <p className="mt-4 text-muted-foreground">
              Comprehensive financial education designed for all ages and skill levels
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.link}>
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer">
                  {/* Background Image */}
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <h3 className="font-serif text-2xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 mb-4">
                      {feature.description}
                    </p>
                    <Button className="w-fit bg-cflp-green hover:bg-cflp-green/90 text-cflp-green-foreground">
                      {feature.cta}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Levels */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">Earn Recognized Certificates</h2>
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
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">Choose Your Learning Path</h2>
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
            <div className="flex items-center gap-3">
              <img src={cflecLogo} alt="CFLEC Logo" className="h-8 w-auto" />
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

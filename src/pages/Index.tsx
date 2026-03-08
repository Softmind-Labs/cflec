import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  Award
} from 'lucide-react';
import { APP_FULL_NAME } from '@/lib/constants';
import cflecLogo from '@/assets/cflec-logo.png';
import onlineLearningImg from '@/assets/features/online-learning.jpg';
import certificatesImg from '@/assets/features/certificates.jpg';
import tradingSimulatorImg from '@/assets/features/trading-simulator.jpg';
import aiAssistedImg from '@/assets/features/ai-assisted.jpg';
import adultsImg from '@/assets/portals/adults.jpg';
import kidsImg from '@/assets/portals/kids.jpg';

const features = [
  {
    image: onlineLearningImg,
    title: '41 Modules',
    description: 'Structured video lessons from money basics to professional investing',
    cta: 'Start Learning',
    link: '/auth',
  },
  {
    image: certificatesImg,
    title: '5 Certificates',
    description: 'Achieve Green, White, Gold, Blue, and Black certifications as you level up',
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

const certificateTiers = [
  { color: 'Green', formal: 'Foundation in Money Awareness', modules: 10, audience: 'Ages 6–11', accent: '#22c55e' },
  { color: 'White', formal: 'Personal Financial Skills', modules: 10, audience: 'Ages 12–15', accent: '#9CA3AF' },
  { color: 'Gold', formal: 'Wealth Building & Markets', modules: 10, audience: 'Ages 16–18', accent: '#d4a017' },
  { color: 'Blue', formal: 'Financial Systems & Investing', modules: 5, audience: 'University+', accent: '#1e3a5f' },
  { color: 'Black', formal: 'Markets, Crypto & Wealth Strategy', modules: 5, audience: 'Professionals', accent: '#000000' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Transparent Header */}
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

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
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
        
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 90%, rgba(0,0,0,0.95) 100%)'
          }}
        />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Sparkles className="mr-1 h-3 w-3" />
            Trusted by 10,000+ learners
          </Badge>
          
          <h1 className="text-5xl font-display tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Master Your
            <br />
            <span className="text-cflp-gold">Financial Future</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg text-white/90 md:text-xl" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
            Ghana's certified financial literacy platform. Learn, earn certificates, and practice with our trading simulator — completely free.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
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
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl text-foreground">Everything You Need to Succeed</h2>
            <p className="mt-4 text-muted-foreground">
              Comprehensive financial education designed for all ages and skill levels
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.link}>
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 mb-4">
                      {feature.description}
                    </p>
                    <Button className="w-fit bg-cflp-blue hover:bg-cflp-blue/90 text-cflp-blue-foreground">
                      {feature.cta}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Pathway */}
      <section className="py-20 bg-[hsl(0_0%_98%)]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl text-foreground">Earn Recognized Certificates</h2>
            <p className="mt-4 text-muted-foreground">
              Five levels of mastery — from money basics to professional investing
            </p>
          </div>

          {/* Desktop: horizontal progression */}
          <div className="hidden md:flex items-start justify-center gap-0">
            {certificateTiers.map((cert, i) => (
              <div key={cert.color} className="flex items-start">
                {/* Certificate unit */}
                <div className="flex flex-col items-center text-center w-[180px]">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${cert.color === 'Black' ? 'ring-2 ring-[hsl(43_76%_47%)]' : ''}`}
                    style={{ backgroundColor: cert.accent }}
                  >
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <p className="mt-3 font-semibold text-foreground text-sm">
                    {cert.color} Certificate
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-tight">
                    {cert.formal}
                  </p>
                  <span className="mt-2 inline-block text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {cert.modules} Modules
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground/70">
                    {cert.audience}
                  </span>
                </div>
                {/* Connector arrow */}
                {i < certificateTiers.length - 1 && (
                  <div className="flex items-center pt-5">
                    <ChevronRight className="h-4 w-4 text-[hsl(220_9%_83%)] mx-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="flex flex-col gap-4 md:hidden">
            {certificateTiers.map((cert, i) => (
              <div key={cert.color}>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${cert.color === 'Black' ? 'ring-2 ring-[hsl(43_76%_47%)]' : ''}`}
                    style={{ backgroundColor: cert.accent }}
                  >
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{cert.color} Certificate</p>
                    <p className="text-xs text-muted-foreground">{cert.formal}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {cert.modules} Modules
                      </span>
                      <span className="text-[11px] text-muted-foreground/70">{cert.audience}</span>
                    </div>
                  </div>
                </div>
                {i < certificateTiers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ChevronDown className="h-4 w-4 text-[hsl(220_9%_83%)]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/auth">
              <Button size="lg" className="bg-[hsl(217_91%_60%)] hover:bg-[hsl(217_91%_55%)] text-white px-8">
                Start Your Journey
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">Choose Your Learning Path</h2>
            <p className="mt-4 text-muted-foreground">
              Age-appropriate content designed for every learner
            </p>
          </div>
          
          {/* Adults & Teens */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative">
              <img 
                src={adultsImg} 
                alt="Adults and teens learning financial literacy" 
                className="rounded-xl w-full h-auto object-cover shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <p className="text-sm font-medium text-primary uppercase tracking-wide">Adults & Teens</p>
              <h3 className="text-3xl md:text-4xl font-display font-bold">
                Master Financial Literacy
              </h3>
              <p className="text-muted-foreground text-lg">
                High Schoolers (13-17) and Adults (18+) can access our full curriculum with 41 modules, stock trading simulator, and earn all 5 certificate levels.
              </p>
              <Link to="/auth?mode=signup">
                <Button className="bg-cflp-blue hover:bg-cflp-blue/90 text-cflp-blue-foreground" size="lg">
                  Enter Adult Portal
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Kids Zone */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <p className="text-sm font-medium text-kids-primary uppercase tracking-wide">Kids Zone</p>
              <h3 className="text-3xl md:text-4xl font-display font-bold">
                Fun Financial Adventures
              </h3>
              <p className="text-muted-foreground text-lg">
                Young learners (6-12) enjoy interactive lessons, games, rewards, and work toward their Green certificate in a colorful, engaging environment.
              </p>
              <Link to="/kids">
                <Button className="bg-kids-primary hover:bg-kids-primary/90 text-kids-primary-foreground" size="lg">
                  Enter Kids Zone
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative order-1 md:order-2">
              <img 
                src={kidsImg} 
                alt="Kids learning about finance through fun activities" 
                className="rounded-xl w-full h-auto object-cover shadow-lg"
              />
            </div>
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

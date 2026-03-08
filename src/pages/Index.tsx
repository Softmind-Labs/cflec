import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  ChevronRight,
  Sparkles,
  Award,
  BarChart3
} from 'lucide-react';
import cflecLogo from '@/assets/cflec-logo.png';
import adultsImg from '@/assets/portals/adults.jpg';
import kidsImg from '@/assets/portals/kids.jpg';

const steps = [
  {
    num: '01',
    title: 'Watch & Learn',
    icon: PlayCircle,
    description: '41 video modules covering money basics to professional investing. Each lesson builds on the last — learn at your own pace.',
  },
  {
    num: '02',
    title: 'Practice Trading',
    icon: BarChart3,
    description: '$500 in virtual money, real market conditions. Build confidence with our stock trading simulator before risking a single cedi.',
  },
  {
    num: '03',
    title: 'Earn Certificates',
    icon: Award,
    description: '5 recognized certificates from Green to Black. Prove your knowledge and stand out to employers, schools, and peers.',
  },
];

const certificates = [
  { color: 'Green', formal: 'Foundation in Money Awareness', modules: 10, audience: 'Ages 6–11', accent: '#22c55e' },
  { color: 'White', formal: 'Personal Financial Skills', modules: 10, audience: 'Ages 12–15', accent: '#9CA3AF' },
  { color: 'Gold', formal: 'Wealth Building & Markets', modules: 10, audience: 'Ages 16–18', accent: '#EAB308' },
  { color: 'Blue', formal: 'Financial Systems & Investing', modules: 5, audience: 'University+', accent: '#1e3a5f' },
  { color: 'Black', formal: 'Markets, Crypto & Wealth Strategy', modules: 5, audience: 'Professionals', accent: '#000000' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/money.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 90%, rgba(0,0,0,0.95) 100%)' }} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Sparkles className="mr-1 h-3 w-3" />
            Trusted by 10,000+ learners
          </Badge>
          <h1 className="text-5xl font-display tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Master Your<br />
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
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground">Three steps to financial mastery</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-start">
                <div className="relative flex-1 text-center px-4">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-8xl font-bold text-muted/60 select-none pointer-events-none leading-none">
                    {step.num}
                  </span>
                  <div className="relative pt-12">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex items-center pt-20 px-1">
                    <ChevronRight className="h-5 w-5 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Path to Mastery */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl text-foreground">Your Path to Mastery</h2>
            <p className="mt-4 text-muted-foreground">Five certificates. One journey from money basics to wealth strategy.</p>
          </div>

          {/* Desktop: horizontal track */}
          <div className="hidden md:block">
            <div className="relative max-w-4xl mx-auto">
              {/* Gradient track line */}
              <div className="absolute top-8 left-[10%] right-[10%] h-0.5" style={{ background: 'linear-gradient(to right, #22c55e, #9CA3AF, #EAB308, #1e3a5f, #000000)' }} />
              
              <div className="flex justify-between relative">
                {certificates.map((cert) => {
                  const isBlack = cert.color === 'Black';
                  return (
                    <div key={cert.color} className="flex flex-col items-center text-center" style={{ width: '18%' }}>
                      <div
                        className={`relative z-10 flex items-center justify-center rounded-full bg-background ${isBlack ? 'w-[72px] h-[72px] ring-2' : 'w-16 h-16'}`}
                        style={isBlack ? { ['--tw-ring-color' as string]: '#EAB308' } : {}}
                      >
                        <div
                          className={`flex items-center justify-center rounded-full ${isBlack ? 'w-16 h-16 ring-2 ring-[#EAB308]' : 'w-14 h-14'}`}
                          style={{ backgroundColor: cert.accent }}
                        >
                          <Award className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      {isBlack && (
                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-cflp-gold">Elite Level</span>
                      )}
                      <p className={`${isBlack ? 'mt-1' : 'mt-3'} font-semibold text-foreground text-sm`}>
                        {cert.color} Certificate
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground leading-tight">{cert.formal}</p>
                      <span className="mt-2 inline-block text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{cert.modules} Modules</span>
                      <span className="mt-1 text-[11px] text-muted-foreground/70">{cert.audience}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: vertical track */}
          <div className="md:hidden relative pl-10">
            {/* Vertical gradient line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, #22c55e, #9CA3AF, #EAB308, #1e3a5f, #000000)' }} />
            
            <div className="flex flex-col gap-8">
              {certificates.map((cert) => {
                const isBlack = cert.color === 'Black';
                return (
                  <div key={cert.color} className="flex items-start gap-5 relative">
                    <div className={`absolute left-[-21px] flex items-center justify-center rounded-full ${isBlack ? 'w-10 h-10 ring-2 ring-[#EAB308]' : 'w-10 h-10'}`} style={{ backgroundColor: cert.accent }}>
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {cert.color} Certificate
                        {isBlack && <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-cflp-gold">Elite</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{cert.formal}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{cert.modules} Modules</span>
                        <span className="text-[11px] text-muted-foreground/70">{cert.audience}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Start Your Journey
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Built for Every Learner */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl text-foreground">Built for Every Learner</h2>
            <p className="mt-4 text-muted-foreground">From age 6 to professional — content designed for your level</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Teens & Adults */}
            <div className="rounded-2xl overflow-hidden bg-background shadow-sm border border-border">
              <div className="relative h-64">
                <img src={adultsImg} alt="Adults and teens learning financial literacy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              <div className="p-8 space-y-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest">Teens & Adults</p>
                <h3 className="text-2xl font-bold text-foreground">Master Financial Literacy</h3>
                <p className="text-muted-foreground">
                  High Schoolers (13–17) and Adults (18+) access 41 modules, the stock trading simulator, and earn all 5 certificate levels.
                </p>
                <Link to="/auth?mode=signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
                    Enter Adult Portal
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Kids Zone */}
            <div className="rounded-2xl overflow-hidden bg-background shadow-sm border border-border">
              <div className="relative h-64">
                <img src={kidsImg} alt="Kids learning about finance through fun activities" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              <div className="p-8 space-y-4">
                <p className="text-xs font-semibold text-kids-primary uppercase tracking-widest">Kids Zone</p>
                <h3 className="text-2xl font-bold text-foreground">Fun Financial Adventures</h3>
                <p className="text-muted-foreground">
                  Young learners (6–12) enjoy interactive lessons, games, rewards, and work toward their Green certificate in a colorful, engaging environment.
                </p>
                <Link to="/kids">
                  <Button className="bg-kids-primary hover:bg-kids-primary/90 text-kids-primary-foreground mt-2">
                    Enter Kids Zone
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[hsl(0_0%_10%)]">
        <div className="container text-center">
          <h2 className="text-3xl font-bold md:text-4xl text-white">Ready to start?</h2>
          <p className="mt-4 text-white/70 max-w-lg mx-auto">
            Join thousands of learners across Ghana building real financial skills. No experience needed.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="mt-8 bg-white text-foreground hover:bg-white/90 px-10 text-base">
              Get Started Free
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-white/40 text-sm">No credit card required · Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={cflecLogo} alt="CFLEC Logo" className="h-8 w-auto" />
              <span className="text-muted-foreground">© 2025</span>
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

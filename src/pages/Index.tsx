import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  PlayCircle, 
  Check,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { APP_FULL_NAME } from '@/lib/constants';
import cflecLogo from '@/assets/cflec-logo.png';
import onlineLearningImg from '@/assets/features/online-learning.jpg';
import certificatesImg from '@/assets/features/certificates.jpg';
import tradingSimulatorImg from '@/assets/features/trading-simulator.jpg';
import aiAssistedImg from '@/assets/features/ai-assisted.jpg';
import adultsImg from '@/assets/portals/adults.jpg';
import kidsImg from '@/assets/portals/kids.jpg';

const DM_SERIF = "'DM Serif Display', Georgia, serif";
const DM_SANS = "'DM Sans', system-ui, sans-serif";

export default function Index() {
  const [scrolled, setScrolled] = useState(false);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            entry.target.classList.remove('opacity-0', 'translate-y-5');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };

  const features = [
    {
      image: onlineLearningImg,
      title: 'Structured Learning',
      category: 'CURRICULUM',
      description: 'Progress through 27 expertly crafted modules',
      cta: 'Start Learning',
      link: '/auth',
      span: 'md:col-span-7',
      height: 'h-[320px] md:h-[480px]',
    },
    {
      image: certificatesImg,
      title: 'Earn Certificates',
      category: 'CREDENTIALS',
      description: 'Achieve Green, White, Gold, and Blue certifications',
      cta: 'View Certificates',
      link: '/auth',
      span: 'md:col-span-5',
      height: 'h-[320px] md:h-[480px]',
    },
    {
      image: tradingSimulatorImg,
      title: 'Stock Simulator',
      category: 'PRACTICE',
      description: 'Practice trading with $500 in virtual money',
      cta: 'Try Simulator',
      link: '/auth',
      span: 'md:col-span-5',
      height: 'h-[280px] md:h-[400px]',
    },
    {
      image: aiAssistedImg,
      title: 'AI-Powered Support',
      category: 'TECHNOLOGY',
      description: 'Get personalized guidance and instant answers',
      cta: 'Learn More',
      link: '/auth',
      span: 'md:col-span-7',
      height: 'h-[280px] md:h-[400px]',
    },
  ];

  const certificates = [
    { level: 'Green', modules: '1-10', borderColor: '#16a34a', accentBg: 'rgba(22,163,74,0.08)', accentText: '#16a34a', description: 'Financial Fundamentals' },
    { level: 'White', modules: '11-20', borderColor: '#E5E7EB', accentBg: 'rgba(107,114,128,0.08)', accentText: '#6B7280', description: 'Investment Basics' },
    { level: 'Gold', modules: '21-26', borderColor: '#E8A020', accentBg: 'rgba(232,160,32,0.08)', accentText: '#E8A020', description: 'Advanced Strategies' },
    { level: 'Blue', modules: '99', borderColor: '#2563EB', accentBg: 'rgba(37,99,235,0.08)', accentText: '#2563EB', description: 'Wealth Management' },
  ];

  return (
    <div style={{ fontFamily: DM_SANS }} className="min-h-screen">
      {/* Top Accent Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-[60] h-[2px]"
        style={{ background: 'linear-gradient(90deg, #E8A020, #2563EB)' }}
      />

      {/* Navigation */}
      <header 
        className="fixed top-[2px] left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={cflecLogo} alt="CFLEC Logo" className="h-10 w-auto" />
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/auth">
              <button 
                className="px-4 h-9 text-sm font-medium text-white/70 hover:text-white transition-colors"
                style={{ fontFamily: DM_SANS }}
              >
                Login
              </button>
            </Link>
            <Link to="/auth">
              <button 
                className="h-9 px-5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-[1.02]"
                style={{ 
                  fontFamily: DM_SANS,
                  backgroundColor: scrolled ? 'white' : 'rgba(10,10,15,0.9)',
                  color: scrolled ? '#0A0A0F' : 'white',
                  border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.15)',
                }}
              >
                Get Started
              </button>
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
            background: 'linear-gradient(to bottom, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.45) 40%, rgba(10,10,15,0.85) 100%)'
          }}
        />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          {/* Glassmorphism pill */}
          <div 
            className="mb-8 flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Sparkles className="h-3 w-3 text-white/50" />
            <span className="text-[13px] text-white/70" style={{ fontFamily: DM_SANS }}>
              Trusted by 10,000+ learners
            </span>
          </div>
          
          <h1 
            className="text-white leading-[0.95] tracking-[-0.03em]"
            style={{ 
              fontFamily: DM_SERIF,
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 400,
            }}
          >
            Master Your
            <br />
            <span style={{ color: '#E8A020' }}>Financial Future</span>
          </h1>
          
          <p 
            className="mt-6 max-w-[520px] text-white/60 leading-relaxed"
            style={{ fontFamily: DM_SANS, fontSize: '1.0625rem' }}
          >
            {APP_FULL_NAME} — Your journey to financial literacy starts here. 
            Learn, practice, earn certificates, and compete with others in our 
            risk-free trading simulator.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <button 
                className="flex items-center gap-2 rounded-full h-12 px-8 font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{ 
                  fontFamily: DM_SANS,
                  fontSize: '0.9375rem',
                  backgroundColor: 'white',
                  color: '#0A0A0F',
                  boxShadow: '0 0 0 rgba(255,255,255,0)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 rgba(255,255,255,0)'}
              >
                <PlayCircle className="h-5 w-5" />
                Start Learning Free
              </button>
            </Link>
            <Link to="/kids">
              <button 
                className="flex items-center gap-2 rounded-full h-12 px-8 font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
                style={{ 
                  fontFamily: DM_SANS,
                  fontSize: '0.9375rem',
                  backgroundColor: 'hsl(280 87% 63%)',
                  boxShadow: '0 0 0 rgba(168,85,247,0)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(168,85,247,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 rgba(168,85,247,0)'}
              >
                <Sparkles className="h-5 w-5" />
                Kids Portal
              </button>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/30" />
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={setSectionRef(0)}
        className="opacity-0 translate-y-5 transition-all duration-700 ease-out"
        style={{ backgroundColor: '#F8F7F4', padding: '120px 0' }}
      >
        <div className="container">
          <div className="text-center mb-14">
            <p 
              className="mb-4 uppercase"
              style={{ fontFamily: DM_SANS, fontSize: '11px', letterSpacing: '0.2em', color: '#6B7280', fontWeight: 600 }}
            >
              Platform Features
            </p>
            <h2 
              style={{ fontFamily: DM_SERIF, fontSize: '2.5rem', color: '#0A0A0F', fontWeight: 400 }}
            >
              Everything You Need to Succeed
            </h2>
            <p className="mt-4" style={{ color: '#6B7280', fontFamily: DM_SANS }}>
              Comprehensive financial education designed for all ages and skill levels
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.link} className={`col-span-1 ${feature.span}`}>
                <div className={`relative ${feature.height} rounded-2xl overflow-hidden group cursor-pointer`}>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div 
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, rgba(10,10,15,0.3) 50%, transparent 100%)' }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  <div className="relative z-10 h-full flex flex-col justify-end p-7">
                    <p 
                      className="mb-2 uppercase"
                      style={{ fontFamily: DM_SANS, fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}
                    >
                      {feature.category}
                    </p>
                    <h3 
                      className="mb-1"
                      style={{ fontFamily: DM_SANS, fontSize: '1.375rem', color: 'white', fontWeight: 700 }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="mb-5"
                      style={{ fontFamily: DM_SANS, fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {feature.description}
                    </p>
                    <button 
                      className="w-fit rounded-full px-5 h-9 text-[13px] bg-transparent transition-all duration-300 hover:bg-white hover:text-[#0A0A0F]"
                      style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontFamily: DM_SANS }}
                    >
                      {feature.cta}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section 
        ref={setSectionRef(1)}
        className="opacity-0 translate-y-5 transition-all duration-700 ease-out bg-white"
        style={{ padding: '120px 0' }}
      >
        <div className="container">
          <div className="text-center mb-14">
            <p 
              className="mb-4 uppercase"
              style={{ fontFamily: DM_SANS, fontSize: '11px', letterSpacing: '0.2em', color: '#6B7280', fontWeight: 600 }}
            >
              Certification Levels
            </p>
            <h2 style={{ fontFamily: DM_SERIF, fontSize: '2.5rem', color: '#0A0A0F', fontWeight: 400 }}>
              Earn Recognized Certificates
            </h2>
            <p className="mt-4" style={{ color: '#6B7280', fontFamily: DM_SANS }}>
              Progress through four levels of mastery and earn certificates to showcase your skills
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {certificates.map((cert) => (
              <div 
                key={cert.level} 
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderLeft: `4px solid ${cert.borderColor}`,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)'}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-5 w-5" style={{ color: cert.accentText }} />
                  <h3 style={{ fontFamily: DM_SANS, fontSize: '1.125rem', fontWeight: 700, color: '#0A0A0F' }}>
                    {cert.level} Certificate
                  </h3>
                </div>
                <p className="mb-4" style={{ fontFamily: DM_SANS, fontSize: '0.875rem', color: '#6B7280' }}>
                  {cert.description}
                </p>
                <span 
                  className="inline-block rounded-md px-2.5 py-0.5 text-xs font-medium mb-5"
                  style={{ backgroundColor: cert.accentBg, color: cert.accentText }}
                >
                  Modules {cert.modules}
                </span>
                <ul className="space-y-2.5">
                  {['Video Lessons', 'Quizzes', 'Practical Simulations'].map((item) => (
                    <li key={item} className="flex items-center gap-2.5" style={{ fontSize: '0.875rem', color: '#374151', fontFamily: DM_SANS }}>
                      <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: cert.accentText }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section 
        ref={setSectionRef(2)}
        className="opacity-0 translate-y-5 transition-all duration-700 ease-out"
        style={{ backgroundColor: '#F8F7F4', padding: '128px 0' }}
      >
        <div className="container">
          <div className="text-center mb-20">
            <h2 style={{ fontFamily: DM_SERIF, fontSize: '2.5rem', color: '#0A0A0F', fontWeight: 400 }}>
              Choose Your Learning Path
            </h2>
            <p className="mt-4" style={{ color: '#6B7280', fontFamily: DM_SANS }}>
              Age-appropriate content designed for every learner
            </p>
          </div>
          
          {/* Adults & Teens */}
          <div className="grid md:grid-cols-2 gap-0 items-stretch mb-24">
            <div className="relative overflow-hidden">
              <img 
                src={adultsImg} 
                alt="Adults and teens learning financial literacy" 
                className="w-full h-full object-cover md:rounded-r-none rounded-t-2xl md:rounded-l-2xl"
                style={{ minHeight: '400px' }}
              />
            </div>
            <div className="flex flex-col justify-center py-16 px-8 md:px-16">
              <p 
                className="mb-4 uppercase"
                style={{ fontFamily: DM_SANS, fontSize: '11px', letterSpacing: '0.2em', color: '#2563EB', fontWeight: 600 }}
              >
                Adults & Teens
              </p>
              <h3 style={{ fontFamily: DM_SERIF, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0A0A0F', fontWeight: 400 }}>
                Master Financial Literacy
              </h3>
              <p className="mt-4 leading-relaxed" style={{ color: '#6B7280', fontFamily: DM_SANS, fontSize: '1.0625rem' }}>
                High Schoolers (13-17) and Adults (18+) can access our full curriculum with 27 modules, stock trading simulator, and earn all 4 certificate levels.
              </p>
              <Link to="/auth?mode=signup" className="mt-8 w-fit">
                <button 
                  className="group flex items-center gap-2 rounded-full h-12 px-8 font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
                  style={{ fontFamily: DM_SANS, backgroundColor: '#2563EB' }}
                >
                  Enter Adult Portal
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
          
          {/* Kids Zone */}
          <div className="grid md:grid-cols-2 gap-0 items-stretch">
            <div className="flex flex-col justify-center py-16 px-8 md:px-16 order-2 md:order-1">
              <p 
                className="mb-4 uppercase"
                style={{ fontFamily: DM_SANS, fontSize: '11px', letterSpacing: '0.2em', color: 'hsl(280 87% 63%)', fontWeight: 600 }}
              >
                Kids Zone
              </p>
              <h3 style={{ fontFamily: DM_SERIF, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0A0A0F', fontWeight: 400 }}>
                Fun Financial Adventures
              </h3>
              <p className="mt-4 leading-relaxed" style={{ color: '#6B7280', fontFamily: DM_SANS, fontSize: '1.0625rem' }}>
                Young learners (6-12) enjoy interactive lessons, games, rewards, and work toward their Green certificate in a colorful, engaging environment.
              </p>
              <Link to="/kids" className="mt-8 w-fit">
                <button 
                  className="group flex items-center gap-2 rounded-full h-12 px-8 font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
                  style={{ fontFamily: DM_SANS, backgroundColor: 'hsl(280 87% 63%)' }}
                >
                  Enter Kids Zone
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
            <div className="relative overflow-hidden order-1 md:order-2">
              <img 
                src={kidsImg} 
                alt="Kids learning about finance through fun activities" 
                className="w-full h-full object-cover md:rounded-l-none rounded-t-2xl md:rounded-r-2xl"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0A0A0F', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={cflecLogo} alt="CFLEC Logo" className="h-8 w-auto brightness-200 invert" />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: DM_SANS, fontSize: '0.875rem' }}>© 2025</span>
            </div>
            <nav className="flex gap-6">
              {['About', 'Contact', 'Terms', 'Privacy'].map((item) => (
                <Link 
                  key={item} 
                  to="#" 
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.5)', fontFamily: DM_SANS, fontSize: '0.875rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

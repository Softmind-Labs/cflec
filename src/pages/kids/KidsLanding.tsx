import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  Star, 
  BookOpen, 
  Trophy,
  ArrowLeft,
  Heart
} from 'lucide-react';

export default function KidsLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kids-background via-background to-kids-secondary/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Main Site</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-kids-primary" />
            <span className="text-xl font-bold text-kids-primary">CFLP Kids</span>
          </div>
          <Link to="/auth">
            <Button className="bg-kids-primary hover:bg-kids-primary/90">
              Sign In
            </Button>
          </Link>
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
          <source src="/videos/kids_money.mp4" type="video/mp4" />
        </video>
        
        {/* Colorful Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0.3) 50%, rgba(249,115,22,0.4) 100%)'
          }}
        />
        
        {/* Hero Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="h-5 w-5 text-kids-secondary fill-kids-secondary" />
            <span className="font-medium text-white">Learning is Fun!</span>
            <Star className="h-5 w-5 text-kids-secondary fill-kids-secondary" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            <span className="text-white">Learn About</span>{' '}
            <span className="text-kids-secondary">Money!</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
            Join thousands of kids learning how to save, spend wisely, and become money smart! 
            Earn stars, badges, and your very own Green Certificate! 🌟
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2 bg-white text-kids-primary hover:bg-white/90 text-lg px-8 py-6">
                <Sparkles className="h-6 w-6" />
                Start Learning!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 bg-white/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You'll Learn 📚
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-kids-primary/20 bg-white shadow-lg">
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-cflp-green/20 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-cflp-green" />
                </div>
                <CardTitle className="text-xl">What is Money?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Learn where money comes from and why we use it every day!
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-kids-primary/20 bg-white shadow-lg">
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-kids-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-kids-secondary" />
                </div>
                <CardTitle className="text-xl">Saving is Cool!</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Discover how saving money helps you get the things you really want!
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-kids-primary/20 bg-white shadow-lg">
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-kids-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-kids-primary" />
                </div>
                <CardTitle className="text-xl">Smart Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Learn to make great choices when buying things!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Earn Your Certificate */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">
            Earn Your Green Certificate! 🏆
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Complete 10 fun lessons, pass the quizzes, and earn your very own 
            Green Certificate to show everyone how money-smart you are!
          </p>
          
          <Card className="max-w-md mx-auto border-4 border-cflp-green bg-gradient-to-br from-cflp-green/10 to-white">
            <CardHeader>
              <div className="h-20 w-20 rounded-full bg-cflp-green flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-cflp-green">Green Certificate</CardTitle>
              <CardDescription className="text-base">Financial Fundamentals</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2">
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-kids-secondary fill-kids-secondary" />
                  10 Fun Video Lessons
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-kids-secondary fill-kids-secondary" />
                  Interactive Quizzes
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-kids-secondary fill-kids-secondary" />
                  Cool Activities
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-white/50">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-kids-primary" />
            <span className="font-bold text-kids-primary">CFLP Kids</span>
          </div>
          <p className="text-sm text-muted-foreground">
            A safe place to learn about money! 
            <Link to="/" className="ml-2 text-primary hover:underline">
              Parent/Adult Portal →
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

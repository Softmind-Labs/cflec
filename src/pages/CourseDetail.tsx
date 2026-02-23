import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpen,
  Clock,
  BarChart3,
  Award,
  CheckCircle2,
  Lock,
  ChevronLeft,
  TrendingUp,
  Landmark,
  ArrowLeftRight,
  Coins,
  PiggyBank,
  FileText,
  type LucideIcon,
} from 'lucide-react';

interface CourseData {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  lessons: number;
  level: string;
  icon: LucideIcon;
  color: string;
  topics: string[];
  lessonList: { title: string; duration: string }[];
}

const courseData: Record<string, CourseData> = {
  'investments-basics': {
    slug: 'investments-basics', title: 'Investment Basics', subtitle: 'From zero to your first investment — learn what investing really means and how to get started.', category: 'Investing', duration: '45 min', lessons: 6, level: 'Beginner', icon: TrendingUp, color: '#2563eb',
    topics: ['Understand the difference between saving and investing', 'Learn about stocks, bonds, and mutual funds', 'Evaluate risk vs. return for different asset classes', 'Build a simple diversified portfolio', 'Know when and how to start investing in Ghana'],
    lessonList: [
      { title: 'What Is Investing?', duration: '8 min' },
      { title: 'Stocks, Bonds & Funds Explained', duration: '10 min' },
      { title: 'Understanding Risk & Return', duration: '7 min' },
      { title: 'Building Your First Portfolio', duration: '8 min' },
      { title: 'Investing on the Ghana Stock Exchange', duration: '7 min' },
      { title: 'Common Mistakes to Avoid', duration: '5 min' },
    ],
  },
  'banking-and-accounts': {
    slug: 'banking-and-accounts', title: 'Banking & Accounts', subtitle: 'How banks really work for you — from savings accounts to fixed deposits and mobile money.', category: 'Banking', duration: '38 min', lessons: 5, level: 'Beginner', icon: Landmark, color: '#16a34a',
    topics: ['Understand different types of bank accounts', 'Learn how interest rates affect your money', 'Compare fixed deposits across Ghanaian banks', 'Use mobile money effectively for savings', 'Protect yourself from banking fraud'],
    lessonList: [
      { title: 'Types of Bank Accounts', duration: '8 min' },
      { title: 'How Interest Rates Work', duration: '7 min' },
      { title: 'Fixed Deposits in Ghana', duration: '8 min' },
      { title: 'Mobile Money & Digital Banking', duration: '8 min' },
      { title: 'Staying Safe with Your Money', duration: '7 min' },
    ],
  },
  'financial-terms': {
    slug: 'financial-terms', title: 'Financial Terms', subtitle: 'The language of money, simplified — learn key financial terms used in everyday life and investing.', category: 'Literacy', duration: '30 min', lessons: 4, level: 'Beginner', icon: BookOpen, color: '#7c3aed',
    topics: ['Define key financial terms with confidence', 'Understand statements, reports, and disclosures', 'Read financial news without confusion', 'Apply terminology to real-world decisions'],
    lessonList: [
      { title: 'Essential Money Vocabulary', duration: '8 min' },
      { title: 'Reading Financial Statements', duration: '8 min' },
      { title: 'Market & Economic Terms', duration: '7 min' },
      { title: 'Putting It All Together', duration: '7 min' },
    ],
  },
  'forex-explained': {
    slug: 'forex-explained', title: 'Forex Explained', subtitle: 'How currencies move and why — understand the foreign exchange market and GHS dynamics.', category: 'Trading', duration: '52 min', lessons: 7, level: 'Intermediate', icon: ArrowLeftRight, color: '#d97706',
    topics: ['Understand how forex markets work globally', 'Learn why the GHS fluctuates against USD/EUR', 'Read currency pair charts and quotes', 'Identify factors that drive exchange rates', 'Know the risks of forex trading'],
    lessonList: [
      { title: 'What Is Forex?', duration: '7 min' },
      { title: 'Currency Pairs & Quotes', duration: '8 min' },
      { title: 'The GHS in Global Markets', duration: '7 min' },
      { title: 'Reading Forex Charts', duration: '8 min' },
      { title: 'What Moves Exchange Rates?', duration: '8 min' },
      { title: 'Forex Trading Risks', duration: '7 min' },
      { title: 'Getting Started Safely', duration: '7 min' },
    ],
  },
  'crypto-basics': {
    slug: 'crypto-basics', title: 'Crypto Basics', subtitle: 'Digital money without the confusion — learn about Bitcoin, Ethereum, and blockchain technology.', category: 'Crypto', duration: '48 min', lessons: 6, level: 'Beginner', icon: Coins, color: '#ea580c',
    topics: ['Understand what cryptocurrency actually is', 'Learn how blockchain technology works', 'Compare Bitcoin, Ethereum, and other tokens', 'Evaluate crypto risks and volatility', 'Know the legal status of crypto in Ghana'],
    lessonList: [
      { title: 'What Is Cryptocurrency?', duration: '8 min' },
      { title: 'How Blockchain Works', duration: '9 min' },
      { title: 'Bitcoin vs Ethereum', duration: '8 min' },
      { title: 'Other Tokens & Altcoins', duration: '7 min' },
      { title: 'Crypto Risks & Volatility', duration: '8 min' },
      { title: 'Crypto in Ghana: What You Need to Know', duration: '8 min' },
    ],
  },
  'budgeting-and-saving': {
    slug: 'budgeting-and-saving', title: 'Budgeting & Saving', subtitle: 'Take control of every cedi — practical strategies for budgeting, saving, and building wealth.', category: 'Personal Finance', duration: '35 min', lessons: 5, level: 'Beginner', icon: PiggyBank, color: '#0891b2',
    topics: ['Create a realistic monthly budget', 'Identify and cut unnecessary spending', 'Build an emergency fund step by step', 'Set and achieve savings goals', 'Use Ghanaian tools and apps for budgeting'],
    lessonList: [
      { title: 'Why Budgets Matter', duration: '7 min' },
      { title: 'Creating Your First Budget', duration: '8 min' },
      { title: 'Cutting Costs Without Sacrifice', duration: '7 min' },
      { title: 'Building an Emergency Fund', duration: '7 min' },
      { title: 'Savings Tools & Apps in Ghana', duration: '6 min' },
    ],
  },
  'ghana-stock-market': {
    slug: 'ghana-stock-market', title: 'Ghana Stock Market', subtitle: 'Invest locally on the GSE — understand how the Ghana Stock Exchange works and how to participate.', category: 'Investing', duration: '42 min', lessons: 6, level: 'Intermediate', icon: BarChart3, color: '#16a34a',
    topics: ['Understand how the GSE operates', 'Learn about listed companies and sectors', 'Read stock quotes and market data', 'Open a brokerage account in Ghana', 'Build a GSE investment strategy'],
    lessonList: [
      { title: 'Introduction to the GSE', duration: '7 min' },
      { title: 'How Stock Trading Works', duration: '8 min' },
      { title: 'GSE Listed Companies', duration: '7 min' },
      { title: 'Reading Market Data', duration: '7 min' },
      { title: 'Opening a Brokerage Account', duration: '7 min' },
      { title: 'Your First GSE Investment', duration: '6 min' },
    ],
  },
  'tbills-and-treasury': {
    slug: 'tbills-and-treasury', title: 'T-Bills & Treasury', subtitle: 'Government securities made simple — learn how Treasury Bills work and how to invest in them.', category: 'Banking', duration: '28 min', lessons: 4, level: 'Beginner', icon: FileText, color: '#6366f1',
    topics: ['Understand what Treasury Bills are', 'Learn about 91-day, 182-day, and 364-day T-Bills', 'Calculate expected returns on T-Bill investments', 'Know how to buy T-Bills through your bank'],
    lessonList: [
      { title: 'What Are Treasury Bills?', duration: '7 min' },
      { title: 'T-Bill Tenors & Rates', duration: '7 min' },
      { title: 'Calculating Your Returns', duration: '7 min' },
      { title: 'How to Buy T-Bills in Ghana', duration: '7 min' },
    ],
  },
};

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = slug ? courseData[slug] : null;

  if (!course) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12 text-center">
          <h1 className="font-display font-bold text-2xl mb-3">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const Icon = course.icon;
  const totalDuration = course.lessonList.reduce((acc, l) => acc + parseInt(l.duration), 0);

  return (
    <MainLayout>
      {/* Full-bleed dark hero */}
      <div className="bg-[hsl(0_0%_6%)] w-full">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12 py-12 md:py-14">
          {/* Back link */}
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center gap-1 text-[0.875rem] font-medium text-white/50 hover:text-white/80 transition-colors mb-6"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Courses
          </button>

          {/* Breadcrumb */}
          <p className="text-[0.8125rem] text-white/40 mb-6">
            Home › Courses › {course.title}
          </p>

          <div className="grid md:grid-cols-5 gap-10 items-start">
            {/* Left — 60% */}
            <div className="md:col-span-3">
              <span
                className="inline-flex items-center rounded-md px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-wide mb-4"
                style={{ backgroundColor: `${course.color}33`, color: course.color }}
              >
                {course.category}
              </span>

              <h1
                className="font-display font-bold text-white tracking-[-0.03em] leading-[1.15]"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}
              >
                {course.title}
              </h1>

              <p className="text-white/65 text-base mt-3 max-w-[480px]">
                {course.subtitle}
              </p>

              <div className="flex items-center gap-4 mt-6 text-[0.875rem] text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-white/50" />
                  {course.duration}
                </span>
                <span className="text-white/30">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-white/50" />
                  {course.lessons} lessons
                </span>
                <span className="text-white/30">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-white/50" />
                  {course.level}
                </span>
              </div>

              <Button
                onClick={() => toast.info('Course content coming soon!')}
                className="h-12 px-8 rounded-[10px] text-base font-semibold gap-2 mt-7"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right — icon card */}
            <div className="md:col-span-2 flex justify-center md:justify-end">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-10 flex flex-col items-center text-center w-full max-w-[280px]">
                <Icon className="h-16 w-16 mb-4" style={{ color: course.color }} strokeWidth={1.5} />
                <p className="font-semibold text-white text-base">{course.title}</p>
                <span className="mt-3 inline-flex items-center bg-white/10 text-white/60 rounded-full px-3.5 py-1 text-[0.75rem] font-medium">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 py-10 md:py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left — course content */}
          <div className="lg:col-span-2 space-y-10">
            {/* What You'll Learn */}
            <div>
              <h2 className="font-display font-semibold text-[1.375rem] mb-5">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {course.topics.map((topic, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: course.color }} />
                    <span className="text-[0.9375rem] text-[hsl(240_4%_26%)]">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Lessons */}
            <div>
              <h2 className="font-display font-semibold text-[1.375rem] mb-1">Course Lessons</h2>
              <p className="text-[0.8125rem] text-muted-foreground mb-5">
                {course.lessons} lessons · {totalDuration} min total
              </p>
              <div className="space-y-2">
                {course.lessonList.map((lesson, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[rgba(0,0,0,0.06)] rounded-[10px] px-5 py-4 flex items-center gap-4"
                  >
                    <span
                      className="h-8 w-8 rounded-full flex items-center justify-center text-[0.75rem] font-bold shrink-0"
                      style={i === 0
                        ? { backgroundColor: `${course.color}1a`, color: course.color }
                        : { backgroundColor: '#f4f4f5', color: '#52525b' }
                      }
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[0.9375rem] text-[hsl(0_0%_4%)]">{lesson.title}</p>
                      <p className="text-[0.8125rem] text-[hsl(240_4%_66%)]">{lesson.duration}</p>
                    </div>
                    {i === 0 ? (
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-[0.75rem] font-medium bg-[#f0fdf4] text-[#16a34a] shrink-0">
                        Preview
                      </span>
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-[hsl(240_4%_66%)] shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div>
            <Card className="sticky top-[88px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <CardContent className="p-7">
                {/* Icon */}
                <div
                  className="h-14 w-14 rounded-[14px] flex items-center justify-center"
                  style={{ backgroundColor: `${course.color}26` }}
                >
                  <Icon className="h-7 w-7" style={{ color: course.color }} />
                </div>

                <h3 className="font-display font-bold text-[1.5rem] text-[hsl(0_0%_4%)] mt-4">
                  Free Course
                </h3>
                <p className="text-[0.875rem] text-muted-foreground mt-1">
                  Free to access
                </p>

                <div className="border-t border-[hsl(0_0%_96%)] my-5" />

                {/* Details */}
                <div className="space-y-0">
                  {[
                    { icon: Clock, label: 'Duration', value: course.duration },
                    { icon: BookOpen, label: 'Lessons', value: `${course.lessons} lessons` },
                    { icon: BarChart3, label: 'Level', value: course.level },
                    { icon: Award, label: 'Certificate', value: 'None' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-[hsl(0_0%_96%)] last:border-b-0">
                      <span className="inline-flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                        <item.icon className="h-3.5 w-3.5 text-[hsl(240_4%_66%)]" />
                        {item.label}
                      </span>
                      <span className="text-[0.875rem] font-medium text-[hsl(0_0%_4%)]">{item.value}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => toast.info('Course content coming soon!')}
                  className="w-full h-12 rounded-[10px] text-[0.9375rem] font-semibold gap-2 mt-6"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-[0.75rem] text-[hsl(240_4%_66%)] text-center mt-2">
                  Free · No payment required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

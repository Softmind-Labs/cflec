import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Landmark,
  BookOpen,
  ArrowLeftRight,
  Coins,
  PiggyBank,
  BarChart3,
  FileText,
  Clock,
  Layers,
  type LucideIcon,
} from 'lucide-react';

interface Course {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  lessons: number;
  icon: LucideIcon;
  color: string;
}

const courses: Course[] = [
  { slug: 'investments-basics', title: 'Investment Basics', subtitle: 'From zero to your first investment', category: 'Investing', duration: '45 min', lessons: 6, icon: TrendingUp, color: '#2563eb' },
  { slug: 'banking-and-accounts', title: 'Banking & Accounts', subtitle: 'How banks really work for you', category: 'Banking', duration: '38 min', lessons: 5, icon: Landmark, color: '#16a34a' },
  { slug: 'financial-terms', title: 'Financial Terms', subtitle: 'The language of money, simplified', category: 'Literacy', duration: '30 min', lessons: 4, icon: BookOpen, color: '#7c3aed' },
  { slug: 'forex-explained', title: 'Forex Explained', subtitle: 'How currencies move and why', category: 'Trading', duration: '52 min', lessons: 7, icon: ArrowLeftRight, color: '#d97706' },
  { slug: 'crypto-basics', title: 'Crypto Basics', subtitle: 'Digital money without the confusion', category: 'Crypto', duration: '48 min', lessons: 6, icon: Coins, color: '#ea580c' },
  { slug: 'budgeting-and-saving', title: 'Budgeting & Saving', subtitle: 'Take control of every cedi', category: 'Personal Finance', duration: '35 min', lessons: 5, icon: PiggyBank, color: '#0891b2' },
  { slug: 'ghana-stock-market', title: 'Ghana Stock Market', subtitle: 'Invest locally on the GSE', category: 'Investing', duration: '42 min', lessons: 6, icon: BarChart3, color: '#16a34a' },
  { slug: 'tbills-and-treasury', title: 'T-Bills & Treasury', subtitle: 'Government securities made simple', category: 'Banking', duration: '28 min', lessons: 4, icon: FileText, color: '#6366f1' },
];

const categories = ['All', 'Investing', 'Banking', 'Trading', 'Crypto', 'Personal Finance'];

export default function Courses() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses.filter((c) => c.category === activeCategory);

  return (
    <MainLayout>
      {/* Full-bleed dark hero */}
      <div className="bg-[hsl(0_0%_6%)] w-full">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12 py-12 md:py-16">
          {/* Breadcrumb */}
          <p className="text-[0.8125rem] text-white/45 mb-4">
            Home › Masterclass
          </p>

          <h1 className="font-display font-bold text-white tracking-[-0.03em] leading-[1.2]" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
            Short Courses
          </h1>
          <p className="text-white/60 mt-3 text-base max-w-xl">
            Pick a topic. Learn it in under an hour. Apply it today.
          </p>
          <p className="text-white/45 text-[0.875rem] mt-4">
            8 short courses · Free with login · Ghana focused
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[68px] z-40 bg-white border-b border-[hsl(0_0%_94%)] shadow-[0_1px_0_hsl(0_0%_94%)]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12 flex items-center gap-2 h-[52px] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                shrink-0 rounded-full px-4 py-1.5 text-[0.8125rem] font-medium
                border transition-all duration-150
                ${
                  activeCategory === cat
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-[hsl(240_6%_90%)] text-muted-foreground hover:border-[hsl(240_5%_84%)] hover:text-foreground bg-transparent'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses grid */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.slug}
                onClick={() => navigate(`/courses/${course.slug}`)}
                className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] overflow-hidden cursor-pointer
                  shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.05)]
                  transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                  hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.12)]"
              >
                {/* Color band */}
                <div
                  className="h-[110px] flex items-center justify-center relative"
                  style={{ backgroundColor: `${course.color}10` }}
                >
                  <Icon className="h-10 w-10" style={{ color: course.color }} strokeWidth={1.5} />
                  {/* Category pill */}
                  <span
                    className="absolute top-3 right-3 bg-white rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                    style={{ color: course.color }}
                  >
                    {course.category}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-bold text-base text-foreground leading-snug mb-1.5">
                    {course.title}
                  </h3>
                  <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {course.subtitle}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-[0.75rem] text-[hsl(240_4%_65%)] mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {course.lessons} lessons
                    </span>
                  </div>

                  {/* Button — tinted bg */}
                  <Button
                    className="w-full rounded-lg text-[0.875rem] font-semibold h-10 border-none transition-colors"
                    style={{
                      backgroundColor: `${course.color}14`,
                      color: course.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = course.color;
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${course.color}14`;
                      e.currentTarget.style.color = course.color;
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course.slug}`);
                    }}
                  >
                    Start Course
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

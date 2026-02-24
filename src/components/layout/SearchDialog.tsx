import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  LineChart,
  Award,
  User,
  TrendingUp,
  Landmark,
  ArrowLeftRight,
  Coins,
  PiggyBank,
  BarChart3,
  FileText,
  Banknote,
  CandlestickChart,
  Building2,
} from 'lucide-react';

const pages = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, keywords: 'home overview progress stats' },
  { label: 'Modules', path: '/modules', icon: BookOpen, keywords: 'lessons learning education videos quiz' },
  { label: 'Courses', path: '/courses', icon: GraduationCap, keywords: 'classes training short courses' },
  { label: 'Simulator', path: '/simulator', icon: LineChart, keywords: 'practice trading simulation virtual' },
  { label: 'Certificates', path: '/certificates', icon: Award, keywords: 'achievements badges credentials' },
  { label: 'Profile', path: '/profile', icon: User, keywords: 'account settings preferences' },
];

const courses = [
  { label: 'Investment Basics', path: '/courses/investments-basics', icon: TrendingUp, keywords: 'investing stocks bonds mutual funds portfolio beginner' },
  { label: 'Banking & Accounts', path: '/courses/banking-and-accounts', icon: Landmark, keywords: 'bank savings account interest fixed deposit mobile money' },
  { label: 'Financial Terms', path: '/courses/financial-terms', icon: BookOpen, keywords: 'literacy vocabulary terminology definitions glossary' },
  { label: 'Forex Explained', path: '/courses/forex-explained', icon: ArrowLeftRight, keywords: 'foreign exchange currency GHS USD EUR cedi trading' },
  { label: 'Crypto Basics', path: '/courses/crypto-basics', icon: Coins, keywords: 'cryptocurrency bitcoin ethereum blockchain digital money' },
  { label: 'Budgeting & Saving', path: '/courses/budgeting-and-saving', icon: PiggyBank, keywords: 'budget save money personal finance spending emergency fund cedi' },
  { label: 'Ghana Stock Market', path: '/courses/ghana-stock-market', icon: BarChart3, keywords: 'GSE ghana stock exchange brokerage shares equities' },
  { label: 'T-Bills & Treasury', path: '/courses/tbills-and-treasury', icon: FileText, keywords: 'treasury bills government securities 91-day 182-day 364-day interest rates' },
];

const simulatorSections = [
  { label: 'Banking Simulator', path: '/simulator/banking', icon: Banknote, keywords: 'treasury bills t-bills interest rates savings' },
  { label: 'Trading Simulator', path: '/simulator/trading', icon: CandlestickChart, keywords: 'crypto forex commodities gold oil bitcoin trade' },
  { label: 'Investment Simulator', path: '/simulator/investment', icon: TrendingUp, keywords: 'GSE stocks world stocks shares portfolio' },
  { label: 'Capital Markets', path: '/simulator/capital-markets', icon: Building2, keywords: 'bonds mutual funds ETFs fixed income' },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (path: string) => {
      onOpenChange(false);
      navigate(path);
    },
    [navigate, onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search courses, simulators, pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              value={`${page.label} ${page.keywords}`}
              onSelect={() => handleSelect(page.path)}
              className="gap-2.5"
            >
              <page.icon className="h-4 w-4 text-muted-foreground" />
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Courses">
          {courses.map((course) => (
            <CommandItem
              key={course.path}
              value={`${course.label} ${course.keywords}`}
              onSelect={() => handleSelect(course.path)}
              className="gap-2.5"
            >
              <course.icon className="h-4 w-4 text-muted-foreground" />
              {course.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Simulators">
          {simulatorSections.map((sim) => (
            <CommandItem
              key={sim.path}
              value={`${sim.label} ${sim.keywords}`}
              onSelect={() => handleSelect(sim.path)}
              className="gap-2.5"
            >
              <sim.icon className="h-4 w-4 text-muted-foreground" />
              {sim.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

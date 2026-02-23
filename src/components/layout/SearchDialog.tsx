import { useEffect, useCallback } from 'react';
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
} from 'lucide-react';

const pages = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Modules', path: '/modules', icon: BookOpen },
  { label: 'Courses', path: '/courses', icon: GraduationCap },
  { label: 'Simulator', path: '/simulator', icon: LineChart },
  { label: 'Certificates', path: '/certificates', icon: Award },
  { label: 'Profile', path: '/profile', icon: User },
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
      <CommandInput placeholder="Search pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              onSelect={() => handleSelect(page.path)}
              className="gap-2.5"
            >
              <page.icon className="h-4 w-4 text-muted-foreground" />
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

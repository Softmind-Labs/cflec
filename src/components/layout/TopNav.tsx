import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Menu, X, User, LogOut } from 'lucide-react';
import cflecLogo from '@/assets/cflec-logo.png';
import { SearchDialog } from './SearchDialog';
import { NotificationDropdown } from './NotificationDropdown';
import { NotificationToast } from './NotificationToast';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Modules', path: '/modules' },
  { label: 'Masterclass', path: '/courses' },
  { label: 'Simulator', path: '/simulator' },
  { label: 'Certificates', path: '/certificates' },
];

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const logoHref = user ? '/dashboard' : '/';

  return (
    <>
      <NotificationToast />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <nav className="sticky top-0 z-50 h-[68px] bg-white border-b border-[hsl(0_0%_94%)] px-5 md:px-12">
        <div className="flex items-center justify-between h-full max-w-[1440px] mx-auto">
          {/* Left — Logo */}
          <Link to={logoHref} className="flex items-center gap-2.5 shrink-0">
            <img src={cflecLogo} alt="CFLEC Logo" className="h-9 w-auto" />
            <span className="font-display font-semibold text-[1.125rem] text-foreground">
              CFLEC
            </span>
          </Link>

          {/* Center — Nav Links (desktop) */}
          <div className="hidden md:flex items-center h-full gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  relative flex items-center h-full px-4 text-[0.9rem] font-medium
                  transition-colors duration-150
                  ${
                    isActive(link.path)
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {link.label}
                {/* Active underline indicator */}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary rounded-t-sm" />
                )}
              </Link>
            ))}
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground" onClick={() => setSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <NotificationDropdown />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden md:flex h-[34px] w-[34px] rounded-full items-center justify-center bg-primary/15 text-primary text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                      <Avatar className="h-[34px] w-[34px]">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
                          {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">{profile?.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile hamburger */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="rounded-lg text-sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="rounded-lg text-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[hsl(0_0%_94%)] overflow-hidden z-40 animate-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center h-12 px-5 text-[0.9rem] font-medium transition-colors
                  ${
                    isActive(link.path)
                      ? 'text-primary border-l-[3px] border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t mt-2 pt-2 px-5">
              <Link
                to="/profile"
                className="flex items-center h-12 text-[0.9rem] font-medium text-muted-foreground hover:text-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center h-12 text-[0.9rem] font-medium text-destructive w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[hsl(0_0%_97.3%)]">
      <TopNav />
      <main className="w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}

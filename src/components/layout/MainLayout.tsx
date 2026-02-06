import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { Footer } from './Footer';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-14 items-center border-b px-4 md:px-6">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold">CFLP</span>
            <span className="text-sm text-muted-foreground">© 2024</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-foreground transition-colors">About</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Contact</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

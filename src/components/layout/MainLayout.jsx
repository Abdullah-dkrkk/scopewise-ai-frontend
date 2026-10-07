import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header onMenuToggle={() => setMobileOpen((open) => !open)} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
        <footer className="border-t py-5">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row lg:px-8">
            <p>
              &copy;
              {new Date().getFullYear()}
              {' '}
              ScopeWise AI. All rights reserved.
            </p>
            <p>Built to catch scope creep before it starts.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

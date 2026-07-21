import { Outlet, Link, useLocation } from 'react-router-dom';
import { Plus, List, MapPin, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Denúncias', icon: List },
  { to: '/nova', label: 'Nova Denúncia', icon: Plus },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <header className="sticky top-0 z-[1200] bg-white/85 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#205ac6] to-[#143675] flex items-center justify-center shadow-sm shadow-[#205ac6]/30">
              <ShieldAlert className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-slate-900 text-base tracking-tight">DPU</span>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> Mangabeira Cidade Verde
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all',
                    active
                      ? 'bg-[#143675] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/70 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> DPU — Mangabeira Cidade Verde
          </p>
          <p>Uma cidade melhor começa com você.</p>
        </div>
      </footer>
    </div>
  );
}

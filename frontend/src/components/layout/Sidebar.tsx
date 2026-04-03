'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clearAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Building2,
  Users,
  BarChart3,
  LogOut,
  FileStack,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: false as const },
  { href: '/protocols', label: 'Protocolos', icon: FileText, exact: false as const },
  { href: '/protocols/new', label: 'Novo Protocolo', icon: FilePlus, exact: true as const },
  { href: '/sectors', label: 'Setores', icon: Building2, exact: false as const },
  { href: '/users', label: 'Usuários', icon: Users, exact: false as const },
  { href: '/reports', label: 'Relatórios', icon: BarChart3, exact: false as const },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    if (item.href === '/protocols') {
      return pathname === '/protocols' || (pathname.startsWith('/protocols/') && !pathname.startsWith('/protocols/new'));
    }
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <aside className="w-64 bg-slate-900 min-h-screen flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <FileStack className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-base leading-none">UniDECK</span>
            <p className="text-slate-500 text-xs mt-0.5">Gestão Documental</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

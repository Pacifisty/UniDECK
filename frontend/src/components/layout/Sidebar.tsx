'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clearAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/protocols', label: 'Protocolos', icon: '📋' },
  { href: '/protocols/new', label: 'Novo Protocolo', icon: '➕' },
  { href: '/sectors', label: 'Setores', icon: '🏢' },
  { href: '/users', label: 'Usuários', icon: '👥' },
  { href: '/reports', label: 'Relatórios', icon: '📈' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-blue-900 min-h-screen flex flex-col text-white">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-xl">📄</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">UniDECK</h1>
            <p className="text-blue-300 text-xs">Gestão Documental</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition"
        >
          <span>🚪</span>
          Sair
        </button>
      </div>
    </aside>
  );
}

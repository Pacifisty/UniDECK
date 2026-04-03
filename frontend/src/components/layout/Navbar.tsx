'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAuth, getUser } from '@/lib/auth';
import { useInboxCounts } from '@/hooks/useInboxCounts';
import { User } from '@/types';
import clsx from 'clsx';
import {
  Search, ChevronDown, FileText, Mail, FileSignature,
  FileCheck, Clipboard, MessageSquare, Eye, AlertCircle,
  Scale, Briefcase, Wrench, UserCheck, Key, Home,
  FolderSearch, Award, HelpCircle, Bell, Rss, UserCircle,
  Shield, MessageCircle, History, LogOut, Network,
  Pen, FileStack, Inbox, Plus, LayoutList, Building2,
} from 'lucide-react';

type DropdownName = 'inbox' | 'novo' | 'listar' | 'estrutura' | 'user' | null;

const documentTypes = [
  { key: 'memorando',         singular: 'Memorando',                    plural: 'Memorandos',                      icon: FileText },
  { key: 'circular',          singular: 'Circular',                     plural: 'Circulares',                      icon: Mail },
  { key: 'oficio',            singular: 'Ofício',                       plural: 'Ofícios',                         icon: FileSignature },
  { key: 'ato-oficial',       singular: 'Ato Oficial',                  plural: 'Atos Oficiais',                   icon: FileCheck },
  { key: 'protocolo',         singular: 'Protocolo',                    plural: 'Protocolos',                      icon: Clipboard },
  { key: 'ouvidoria',         singular: 'Ouvidoria',                    plural: 'Ouvidorias',                      icon: MessageSquare },
  { key: 'esic',              singular: 'Pedido e-SIC',                 plural: 'Pedidos e-SIC',                   icon: Eye },
  { key: 'fiscalizacao',      singular: 'Fiscalização',                 plural: 'Fiscalizações',                   icon: AlertCircle },
  { key: 'parecer',           singular: 'Parecer',                      plural: 'Pareceres',                       icon: Scale },
  { key: 'processo-adm',      singular: 'Processo Administrativo',      plural: 'Processos Administrativos',       icon: Briefcase },
  { key: 'chamado',           singular: 'Chamado Técnico',              plural: 'Chamados Técnicos',               icon: Wrench },
  { key: 'processo-seletivo', singular: 'Processo Seletivo Simplificado', plural: 'Processos Seletivos Simplificados', icon: UserCheck },
  { key: 'alvara',            singular: 'Alvará',                       plural: 'Alvarás',                         icon: Key },
  { key: 'habite-se',         singular: 'Habite-se',                    plural: 'Habite-se',                       icon: Home },
  { key: 'analise-projeto',   singular: 'Análise de Projeto',           plural: 'Análises de Projeto',             icon: FolderSearch },
  { key: 'certidao',          singular: 'Certidão',                     plural: 'Certidões',                       icon: Award },
];

const userMenuItems = [
  { label: 'Central de Ajuda',         icon: HelpCircle,    href: '/help' },
  { label: 'Novidades',                icon: Bell,          href: '/news' },
  { label: 'Blog',                     icon: Rss,           href: '/blog' },
  { label: 'Minha Conta',             icon: UserCircle,    href: '/account' },
  { label: 'Segurança',               icon: Shield,        href: '/security' },
  { label: 'Chat com Suporte',        icon: MessageCircle, href: '/support' },
  { label: 'Histórico de Atendimento', icon: History,       href: '/history' },
];

function DropdownItem({
  icon: Icon,
  label,
  href,
  badge,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-100 rounded-md mx-1"
    >
      <Icon className="w-4 h-4 shrink-0 text-slate-400" />
      <span className="truncate flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="ml-auto min-w-[1.25rem] h-5 px-1 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownName>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const inboxCounts = useInboxCounts();

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Close dropdown when clicking outside the navbar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggle = (name: DropdownName) =>
    setOpenDropdown(prev => (prev === name ? null : name));

  const close = () => setOpenDropdown(null);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const navBtnClass = (name: DropdownName) =>
    clsx(
      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap',
      openDropdown === name
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
    );

  const dropdownClass = (visible: boolean) =>
    clsx(
      'absolute top-full mt-1.5 z-50 bg-white rounded-xl shadow-2xl border border-slate-200',
      'transition-all duration-200 ease-out origin-top',
      visible
        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
        : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
    );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-blue-900 border-b border-blue-800 shadow-lg"
    >
      <div className="flex items-center h-14 px-4 gap-2">
        {/* ── Logo ── */}
        <Link
          href="/dashboard"
          onClick={close}
          className="flex items-center gap-2.5 mr-2 shrink-0 group"
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-150">
            <FileStack className="w-5 h-5 text-blue-900" />
          </div>
          <span className="font-bold text-white text-base hidden sm:block tracking-tight">
            UniDECK
          </span>
        </Link>

        {/* ── Search ── */}
        <div className="relative hidden md:block w-56 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-blue-800 border border-blue-700 rounded-lg
                       text-white placeholder:text-blue-400
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                       transition-colors duration-150"
          />
        </div>

        {/* ── Nav Menu Items ── */}
        <div className="flex items-center gap-0.5 ml-2">

          {/* Inbox */}
          <div className="relative">
            <button className={navBtnClass('inbox')} onClick={() => toggle('inbox')}>
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
              <ChevronDown
                className={clsx(
                  'w-3.5 h-3.5 transition-transform duration-200',
                  openDropdown === 'inbox' && 'rotate-180'
                )}
              />
            </button>
            <div className={clsx(dropdownClass(openDropdown === 'inbox'), 'left-0 w-52')}>
              <div className="py-1.5">
                <DropdownItem icon={Inbox}      label="Inbox principal" href="/protocols?view=sector"   badge={inboxCounts.sectorCount}   onClick={close} />
                <DropdownItem icon={UserCircle} label="Inbox pessoal"   href="/protocols?view=personal" badge={inboxCounts.personalCount} onClick={close} />
              </div>
            </div>
          </div>

          {/* + Novo */}
          <div className="relative">
            <button className={navBtnClass('novo')} onClick={() => toggle('novo')}>
              <Plus className="w-4 h-4" />
              <span>Novo</span>
              <ChevronDown
                className={clsx(
                  'w-3.5 h-3.5 transition-transform duration-200',
                  openDropdown === 'novo' && 'rotate-180'
                )}
              />
            </button>
            <div className={clsx(dropdownClass(openDropdown === 'novo'), 'left-0 w-[500px]')}>
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Criar novo documento
                </p>
              </div>
              <div className="py-1.5 grid grid-cols-2">
                {documentTypes.map(dt => (
                  <DropdownItem
                    key={dt.key}
                    icon={dt.icon}
                    label={dt.singular}
                    href={`/protocols/new?docType=${dt.key}`}
                    onClick={close}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Listar */}
          <div className="relative">
            <button className={navBtnClass('listar')} onClick={() => toggle('listar')}>
              <LayoutList className="w-4 h-4" />
              <span>Listar</span>
              <ChevronDown
                className={clsx(
                  'w-3.5 h-3.5 transition-transform duration-200',
                  openDropdown === 'listar' && 'rotate-180'
                )}
              />
            </button>
            <div className={clsx(dropdownClass(openDropdown === 'listar'), 'left-0 w-[500px]')}>
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Listar documentos
                </p>
              </div>
              <div className="py-1.5 grid grid-cols-2">
                {documentTypes.map(dt => (
                  <DropdownItem
                    key={dt.key}
                    icon={dt.icon}
                    label={dt.plural}
                    href={`/protocols?filterType=${dt.key}`}
                    onClick={close}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Estrutura */}
          <div className="relative">
            <button className={navBtnClass('estrutura')} onClick={() => toggle('estrutura')}>
              <Building2 className="w-4 h-4" />
              <span>Estrutura</span>
              <ChevronDown
                className={clsx(
                  'w-3.5 h-3.5 transition-transform duration-200',
                  openDropdown === 'estrutura' && 'rotate-180'
                )}
              />
            </button>
            <div className={clsx(dropdownClass(openDropdown === 'estrutura'), 'left-0 w-52')}>
              <div className="py-1.5">
                <DropdownItem icon={Network} label="Organograma"         href="/sectors/org-chart" onClick={close} />
                <DropdownItem icon={Pen}     label="Fila de assinaturas" href="/signatures"        onClick={close} />
              </div>
            </div>
          </div>

        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Mobile Search button ── */}
        <button className="md:hidden p-2 text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg transition-colors duration-150">
          <Search className="w-4 h-4" />
        </button>

        {/* ── User Menu ── */}
        <div className="relative">
          <button
            onClick={() => toggle('user')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors duration-150"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <span className="hidden lg:block max-w-[8rem] truncate">
              {user?.name || 'Usuário'}
            </span>
            <ChevronDown
              className={clsx(
                'w-3.5 h-3.5 transition-transform duration-200',
                openDropdown === 'user' && 'rotate-180'
              )}
            />
          </button>

          <div className={clsx(dropdownClass(openDropdown === 'user'), 'right-0 w-56')}>
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || 'Usuário'}
              </p>
              {user?.email && (
                <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
              )}
            </div>
            <div className="py-1.5">
              {userMenuItems.map(item => (
                <DropdownItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  onClick={close}
                />
              ))}
            </div>
            <div className="border-t border-slate-100 py-1.5 px-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-100 rounded-md"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

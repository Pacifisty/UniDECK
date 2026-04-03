'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { DashboardStats } from '@/types';
import {
  FileText, Clock, ArrowRight, CheckCircle2, Users, Building2,
  FilePlus, BarChart3, Loader2, TrendingUp,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'amber' | 'indigo' | 'emerald' | 'violet' | 'slate';
}

const colorMap = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    value: 'text-blue-700',    border: 'border-blue-100' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   value: 'text-amber-700',   border: 'border-amber-100' },
  indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  value: 'text-indigo-700',  border: 'border-indigo-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', value: 'text-emerald-700', border: 'border-emerald-100' },
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600',  value: 'text-violet-700',  border: 'border-violet-100' },
  slate:   { bg: 'bg-slate-50',   icon: 'text-slate-600',   value: 'text-slate-700',   border: 'border-slate-100' },
};

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`card p-5 border ${c.border} flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${c.value}`}>{value}</p>
      </div>
    </div>
  );
}

const quickActions = [
  { href: '/protocols/new', label: 'Novo Protocolo', desc: 'Criar protocolo',   icon: FilePlus,   color: 'bg-blue-600 hover:bg-blue-700' },
  { href: '/protocols',     label: 'Ver Protocolos', desc: 'Listar todos',      icon: FileText,   color: 'bg-indigo-600 hover:bg-indigo-700' },
  { href: '/sectors',       label: 'Setores',        desc: 'Gerenciar setores', icon: Building2,  color: 'bg-violet-600 hover:bg-violet-700' },
  { href: '/reports',       label: 'Relatórios',     desc: 'Ver analytics',     icon: BarChart3,  color: 'bg-emerald-600 hover:bg-emerald-700' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/dashboard')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Visão geral do sistema</p>
          </div>
          <button onClick={() => router.push('/protocols/new')} className="btn-primary">
            <FilePlus className="w-4 h-4" />
            Novo Protocolo
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm">Carregando...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard title="Total de Protocolos" value={stats?.totalProtocols || 0}     icon={FileText}     color="blue" />
              <StatCard title="Pendentes"            value={stats?.pendingProtocols || 0}   icon={Clock}        color="amber" />
              <StatCard title="Em Andamento"         value={stats?.inProgressProtocols || 0} icon={ArrowRight}  color="indigo" />
              <StatCard title="Concluídos"           value={stats?.completedProtocols || 0} icon={CheckCircle2} color="emerald" />
              <StatCard title="Usuários Ativos"      value={stats?.totalUsers || 0}         icon={Users}        color="violet" />
              <StatCard title="Setores"              value={stats?.totalSectors || 0}       icon={Building2}    color="slate" />
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <h2 className="section-title">Ações Rápidas</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.href}
                      href={action.href}
                      className={`group flex flex-col items-center gap-2.5 p-4 rounded-xl text-white ${action.color} transition-all duration-150 active:scale-95`}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <p className="text-sm font-semibold">{action.label}</p>
                        <p className="text-xs opacity-75 mt-0.5">{action.desc}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

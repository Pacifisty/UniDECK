'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Protocol } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart3, Clock, CheckCircle2, AlertTriangle, FileText,
  TrendingUp, Loader2, ArrowRight, Building2, Calendar,
} from 'lucide-react';

interface TopSector {
  sectorName: string;
  count: string;
}

function StatCard({ value, label, icon: Icon, color }: { value: number | string; label: string; icon: React.ElementType; color: string }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [topSectors, setTopSectors] = useState<TopSector[]>([]);
  const [overdueProtocols, setOverdueProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports/dashboard'),
      api.get('/reports/top-sectors'),
      api.get('/reports/overdue'),
    ]).then(([statsRes, sectorsRes, overdueRes]) => {
      setDashboardStats(statsRes.data);
      setTopSectors(sectorsRes.data);
      setOverdueProtocols(overdueRes.data);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="loading-state">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-sm text-slate-500">Carregando relatórios...</span>
      </div>
    </MainLayout>
  );

  const maxCount = topSectors.length > 0 ? Math.max(...topSectors.map(s => parseInt(s.count))) : 1;

  return (
    <MainLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-500" />
          <h1 className="page-title">Relatórios</h1>
        </div>

        {dashboardStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={dashboardStats.totalProtocols}     label="Total de Protocolos" icon={FileText}     color="bg-blue-100 text-blue-600" />
            <StatCard value={dashboardStats.pendingProtocols}   label="Pendentes"           icon={Clock}        color="bg-amber-100 text-amber-600" />
            <StatCard value={dashboardStats.inProgressProtocols} label="Em Andamento"       icon={ArrowRight}   color="bg-indigo-100 text-indigo-600" />
            <StatCard value={dashboardStats.completedProtocols} label="Concluídos"          icon={CheckCircle2} color="bg-emerald-100 text-emerald-600" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-4 h-4 text-slate-500" />
              <h2 className="section-title">Setores com Maior Demanda</h2>
            </div>
            {topSectors.length === 0 ? (
              <div className="empty-state py-8">
                <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">Sem dados disponíveis</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topSectors.map((sector, idx) => {
                  const pct = Math.round((parseInt(sector.count) / maxCount) * 100);
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700 truncate mr-2">{sector.sectorName || 'Sem setor'}</span>
                        <span className="text-sm font-bold text-blue-600 shrink-0">{sector.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="section-title">Protocolos com Prazo Vencido</h2>
            </div>
            {overdueProtocols.length === 0 ? (
              <div className="empty-state py-8">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">Nenhum prazo vencido</p>
                <p className="text-xs text-slate-500 mt-1">Todos os protocolos estão dentro do prazo!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {overdueProtocols.slice(0, 6).map((protocol) => (
                  <a
                    key={protocol.id}
                    href={`/protocols/${protocol.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="min-w-0 mr-3">
                      <p className="text-sm font-semibold text-blue-600 font-mono group-hover:underline">{protocol.number}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{protocol.subject}</p>
                    </div>
                    {protocol.dueDate && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3 h-3 text-red-400" />
                        <span className="text-xs font-semibold text-red-500">
                          {format(new Date(protocol.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </a>
                ))}
                {overdueProtocols.length > 6 && (
                  <p className="text-xs text-center text-slate-400 pt-1">
                    +{overdueProtocols.length - 6} protocolos vencidos
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

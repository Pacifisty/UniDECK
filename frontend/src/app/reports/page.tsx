'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Protocol } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TopSector {
  sectorName: string;
  count: string;
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

  if (loading) return <MainLayout><div className="text-center py-12 text-gray-500">Carregando relatórios...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardStats && (
            <>
              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-600">{dashboardStats.totalProtocols}</div>
                <div className="text-sm text-gray-500 mt-1">Total de Protocolos</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-yellow-500">{dashboardStats.pendingProtocols}</div>
                <div className="text-sm text-gray-500 mt-1">Pendentes</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-500">{dashboardStats.inProgressProtocols}</div>
                <div className="text-sm text-gray-500 mt-1">Em Andamento</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-green-500">{dashboardStats.completedProtocols}</div>
                <div className="text-sm text-gray-500 mt-1">Concluídos</div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Setores com Maior Demanda</h2>
            {topSectors.length === 0 ? (
              <p className="text-gray-500 text-sm">Sem dados disponíveis</p>
            ) : (
              <div className="space-y-3">
                {topSectors.map((sector, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{sector.sectorName || 'Sem setor'}</span>
                    <span className="text-sm font-semibold text-blue-600">{sector.count} protocolos</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Protocolos com Prazo Vencido</h2>
            {overdueProtocols.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum protocolo vencido 🎉</p>
            ) : (
              <div className="space-y-3">
                {overdueProtocols.slice(0, 5).map((protocol) => (
                  <div key={protocol.id} className="flex items-center justify-between">
                    <div>
                      <a href={`/protocols/${protocol.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                        {protocol.number}
                      </a>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{protocol.subject}</p>
                    </div>
                    <span className="text-xs text-red-500">
                      {protocol.dueDate && format(new Date(protocol.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

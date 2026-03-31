'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { DashboardStats } from '@/types';

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard title="Total de Protocolos" value={stats?.totalProtocols || 0} icon="📋" color="bg-blue-50" />
              <StatCard title="Pendentes" value={stats?.pendingProtocols || 0} icon="⏳" color="bg-yellow-50" />
              <StatCard title="Em Andamento" value={stats?.inProgressProtocols || 0} icon="🔄" color="bg-blue-50" />
              <StatCard title="Concluídos" value={stats?.completedProtocols || 0} icon="✅" color="bg-green-50" />
              <StatCard title="Usuários Ativos" value={stats?.totalUsers || 0} icon="👥" color="bg-purple-50" />
              <StatCard title="Setores" value={stats?.totalSectors || 0} icon="🏢" color="bg-indigo-50" />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <a href="/protocols/new" className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-center">
                  <span className="text-2xl">📝</span>
                  <span className="text-sm font-medium text-blue-700">Novo Protocolo</span>
                </a>
                <a href="/protocols" className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition text-center">
                  <span className="text-2xl">📋</span>
                  <span className="text-sm font-medium text-green-700">Ver Protocolos</span>
                </a>
                <a href="/sectors" className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-center">
                  <span className="text-2xl">🏢</span>
                  <span className="text-sm font-medium text-purple-700">Setores</span>
                </a>
                <a href="/reports" className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition text-center">
                  <span className="text-2xl">📈</span>
                  <span className="text-sm font-medium text-orange-700">Relatórios</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

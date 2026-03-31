'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import api from '@/lib/api';
import { Protocol } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProtocolsPage() {
  const router = useRouter();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProtocols = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await api.get(`/protocols?${params}`);
      setProtocols(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProtocols(); }, [page, search, statusFilter]);

  const totalPages = Math.ceil(total / 15);

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Protocolos</h1>
          <button
            onClick={() => router.push('/protocols/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Novo Protocolo
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por número, assunto, requerente..."
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="archived">Arquivado</option>
              <option value="returned">Devolvido</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Carregando...</div>
          ) : protocols.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Nenhum protocolo encontrado</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Número</th>
                  <th className="px-6 py-3 text-left">Assunto</th>
                  <th className="px-6 py-3 text-left">Requerente</th>
                  <th className="px-6 py-3 text-left">Setor Atual</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Prioridade</th>
                  <th className="px-6 py-3 text-left">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {protocols.map((protocol) => (
                  <tr
                    key={protocol.id}
                    onClick={() => router.push(`/protocols/${protocol.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 text-sm font-mono font-medium text-blue-600">
                      {protocol.number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {protocol.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {protocol.requesterName || protocol.createdBy?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {protocol.currentSector?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={protocol.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={protocol.priority} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(protocol.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Protocol } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FilePlus, Search, SlidersHorizontal, ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react';

const documentTypeLabels: Record<string, string> = {
  memorando: 'Memorandos',
  circular: 'Circulares',
  oficio: 'Ofícios',
  'ato-oficial': 'Atos Oficiais',
  protocolo: 'Protocolos',
  ouvidoria: 'Ouvidorias',
  esic: 'Pedidos e-SIC',
  fiscalizacao: 'Fiscalizações',
  parecer: 'Pareceres',
  'processo-adm': 'Processos Administrativos',
  chamado: 'Chamados Técnicos',
  'processo-seletivo': 'Processos Seletivos Simplificados',
  alvara: 'Alvarás',
  'habite-se': 'Habite-se',
  'analise-projeto': 'Análises de Projeto',
  certidao: 'Certidões',
};

export default function ProtocolsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const filterType = searchParams.get('filterType');

  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const LIMIT = 15;

  const fetchProtocols = useCallback(async () => {
    setLoading(true);
    try {
      const user = getUser();
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(filterType && { type: filterType }),
        ...(viewParam === 'sector' && user?.sectorId ? { sectorId: user.sectorId } : {}),
        ...(viewParam === 'personal' && user?.id ? { createdById: user.id } : {}),
      });
      const res = await api.get(`/protocols?${params}`);
      setProtocols(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, viewParam, filterType]);

  useEffect(() => { fetchProtocols(); }, [fetchProtocols]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [viewParam, filterType]);

  const totalPages = Math.ceil(total / LIMIT);

  const pageTitle = viewParam === 'sector'
    ? 'Inbox Principal'
    : viewParam === 'personal'
    ? 'Inbox Pessoal'
    : filterType && documentTypeLabels[filterType]
    ? documentTypeLabels[filterType]
    : 'Protocolos';

  const emptyHint = search || statusFilter || filterType || viewParam
    ? 'Tente ajustar os filtros de busca.'
    : 'Crie o primeiro protocolo clicando em "Novo Protocolo".';

  return (
    <MainLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">{pageTitle}</h1>
            <p className="text-sm text-slate-500 mt-1">{total} protocolo{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => router.push('/protocols/new')} className="btn-primary">
            <FilePlus className="w-4 h-4" />
            Novo Protocolo
          </button>
        </div>

        <div className="card p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar por número, assunto, requerente..."
                className="input-base pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="input-base w-auto"
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="waiting_signature">Aguardando Assinatura</option>
                <option value="signed">Assinado</option>
                <option value="completed">Concluído</option>
                <option value="archived">Arquivado</option>
                <option value="returned">Devolvido</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-slate-500">Carregando protocolos...</span>
            </div>
          ) : protocols.length === 0 ? (
            <div className="empty-state">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-medium text-slate-700">Nenhum protocolo encontrado</p>
              <p className="text-sm text-slate-500 mt-1">{emptyHint}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th>Número</th>
                  <th>Assunto</th>
                  <th>Requerente</th>
                  <th>Setor Atual</th>
                  <th>Status</th>
                  <th>Prioridade</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {protocols.map((protocol) => (
                  <tr
                    key={protocol.id}
                    onClick={() => router.push(`/protocols/${protocol.id}`)}
                    className="table-row cursor-pointer"
                  >
                    <td>
                      <span className="text-sm font-mono font-semibold text-blue-600">{protocol.number}</span>
                    </td>
                    <td>
                      <span className="text-sm text-slate-900 font-medium line-clamp-1 max-w-xs block">{protocol.subject}</span>
                    </td>
                    <td>
                      <span className="text-sm text-slate-600">{protocol.requesterName || protocol.createdBy?.name || '—'}</span>
                    </td>
                    <td>
                      <span className="text-sm text-slate-600">{protocol.currentSector?.name || '—'}</span>
                    </td>
                    <td><StatusBadge status={protocol.status} /></td>
                    <td><PriorityBadge priority={protocol.priority} /></td>
                    <td>
                      <span className="text-sm text-slate-500">{format(new Date(protocol.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Mostrando {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} de {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost p-2 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost p-2 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import api from '@/lib/api';
import { Protocol } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pen, FileText, Loader2 } from 'lucide-react';

export default function SignaturesPage() {
  const router = useRouter();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Protocol[]>('/protocols/pending-signatures')
      .then(res => setProtocols(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center gap-3">
          <Pen className="w-5 h-5 text-blue-600" />
          <div>
            <h1 className="page-title">Fila de Assinaturas</h1>
            <p className="text-sm text-slate-500 mt-1">
              Protocolos aguardando sua assinatura
            </p>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-slate-500">Carregando...</span>
            </div>
          ) : protocols.length === 0 ? (
            <div className="empty-state">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-medium text-slate-700">Nenhum protocolo aguardando assinatura</p>
              <p className="text-sm text-slate-500 mt-1">Não há documentos pendentes de assinatura no momento.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th>Número</th>
                  <th>Assunto</th>
                  <th>Tipo</th>
                  <th>Setor Atual</th>
                  <th>Status</th>
                  <th>Prioridade</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {protocols.map(protocol => (
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
                      <span className="text-sm text-slate-600">{protocol.documentType || '—'}</span>
                    </td>
                    <td>
                      <span className="text-sm text-slate-600">{protocol.currentSector?.name || '—'}</span>
                    </td>
                    <td><StatusBadge status={protocol.status} /></td>
                    <td><PriorityBadge priority={protocol.priority} /></td>
                    <td>
                      <span className="text-sm text-slate-500">
                        {format(new Date(protocol.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

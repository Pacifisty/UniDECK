'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import api from '@/lib/api';
import { Protocol, Movement, Sector, MOVEMENT_TYPE_LABELS } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft, Send, X, Loader2, GitBranch, User, Building2, Calendar, Clock,
  FileText, AlertCircle,
} from 'lucide-react';

interface DispatchForm {
  type: string;
  toSectorId: string;
  observations: string;
}

export default function ProtocolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [showDispatch, setShowDispatch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);

  const { register, handleSubmit, reset } = useForm<DispatchForm>({
    defaultValues: { type: 'forward' }
  });

  const fetchData = async () => {
    try {
      const [protocolRes, movementsRes] = await Promise.all([
        api.get(`/protocols/${id}`),
        api.get(`/movements/protocol/${id}`),
      ]);
      setProtocol(protocolRes.data);
      setMovements(movementsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    api.get('/sectors').then(res => setSectors(res.data)).catch(console.error);
  }, [id]);

  const onDispatch = async (data: DispatchForm) => {
    setDispatching(true);
    try {
      await api.post('/movements', {
        protocolId: id,
        ...data,
        fromSectorId: protocol?.currentSector?.id,
      });
      reset();
      setShowDispatch(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDispatching(false);
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="loading-state">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-sm text-slate-500">Carregando protocolo...</span>
      </div>
    </MainLayout>
  );

  if (!protocol) return (
    <MainLayout>
      <div className="empty-state">
        <AlertCircle className="w-10 h-10 text-slate-400 mb-3" />
        <p className="font-medium text-slate-700">Protocolo não encontrado</p>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn-ghost py-1.5">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500">Protocolo</span>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-900 font-mono">{protocol.number}</span>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-mono text-slate-500 font-medium">{protocol.number}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-snug">{protocol.subject}</h1>
              {protocol.documentType && (
                <p className="text-sm text-slate-500 mt-1">{protocol.documentType}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <StatusBadge status={protocol.status} />
              <PriorityBadge priority={protocol.priority} />
              {protocol.isExternal && (
                <span className="badge bg-teal-100 text-teal-700 ring-1 ring-teal-200">Externo</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-slate-100">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Setor Atual</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{protocol.currentSector?.name || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Setor de Origem</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{protocol.originSector?.name || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Aberto por</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{protocol.createdBy?.name || '—'}</p>
              </div>
            </div>
            {protocol.requesterName && (
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Requerente</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{protocol.requesterName}</p>
                </div>
              </div>
            )}
            {protocol.requesterCpfCnpj && (
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">CPF/CNPJ</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{protocol.requesterCpfCnpj}</p>
                </div>
              </div>
            )}
            {protocol.dueDate && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Prazo</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {format(new Date(protocol.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Criado em</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {format(new Date(protocol.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>

          {(protocol.description || protocol.observations) && (
            <div className="mt-4 space-y-3">
              {protocol.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Descrição</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{protocol.description}</p>
                </div>
              )}
              {protocol.observations && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Observações</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{protocol.observations}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-slate-500" />
              <h2 className="section-title">Tramitações</h2>
              <span className="badge bg-slate-100 text-slate-600 ring-1 ring-slate-200">{movements.length}</span>
            </div>
            <button
              onClick={() => setShowDispatch(!showDispatch)}
              className={showDispatch ? 'btn-secondary' : 'btn-primary'}
            >
              {showDispatch ? (
                <><X className="w-4 h-4" /> Cancelar</>
              ) : (
                <><Send className="w-4 h-4" /> Despachar</>
              )}
            </button>
          </div>

          {showDispatch && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Nova Tramitação</h3>
              <form onSubmit={handleSubmit(onDispatch)} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Ação</label>
                    <select {...register('type')} className="input-base">
                      <option value="forward">Encaminhar</option>
                      <option value="dispatch">Despachar</option>
                      <option value="return">Devolver</option>
                      <option value="receive">Receber</option>
                      <option value="archive">Arquivar</option>
                      <option value="comment">Comentar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Setor Destino</label>
                    <select {...register('toSectorId')} className="input-base">
                      <option value="">Selecionar setor</option>
                      {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Observações</label>
                  <textarea
                    {...register('observations')}
                    rows={2}
                    className="input-base resize-none"
                    placeholder="Observações sobre a tramitação..."
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button type="button" onClick={() => setShowDispatch(false)} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" disabled={dispatching} className="btn-primary">
                    {dispatching ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Confirmar</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {movements.length === 0 ? (
            <div className="empty-state py-10">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <GitBranch className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">Nenhuma tramitação registrada</p>
              <p className="text-xs text-slate-500 mt-1">Use o botão &quot;Despachar&quot; para registrar uma tramitação.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200" />
              <div className="space-y-4">
                {movements.map((movement, idx) => (
                  <div key={movement.id} className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 z-10 shrink-0 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="text-sm font-semibold text-slate-900">
                            {MOVEMENT_TYPE_LABELS[movement.type] || movement.type}
                          </span>
                          {movement.fromSector && (
                            <span className="text-xs text-slate-500 ml-2">de {movement.fromSector.name}</span>
                          )}
                          {movement.toSector && (
                            <span className="text-xs text-blue-600 font-medium ml-1">→ {movement.toSector.name}</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">
                          {format(new Date(movement.createdAt), 'dd/MM/yy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      {movement.observations && (
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{movement.observations}</p>
                      )}
                      {movement.fromUser?.name && (
                        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {movement.fromUser.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

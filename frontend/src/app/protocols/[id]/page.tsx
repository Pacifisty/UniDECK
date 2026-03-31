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

  if (loading) return <MainLayout><div className="text-center py-12 text-gray-500">Carregando...</div></MainLayout>;
  if (!protocol) return <MainLayout><div className="text-center py-12 text-gray-500">Protocolo não encontrado</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">← Voltar</button>
          <h1 className="text-2xl font-bold text-gray-900">Protocolo {protocol.number}</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{protocol.subject}</h2>
              {protocol.documentType && <p className="text-sm text-gray-500 mt-1">{protocol.documentType}</p>}
            </div>
            <div className="flex gap-2">
              <StatusBadge status={protocol.status} />
              <PriorityBadge priority={protocol.priority} />
              {protocol.isExternal && (
                <span className="status-badge bg-teal-100 text-teal-800">Externo</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Setor Atual</p>
              <p className="font-medium">{protocol.currentSector?.name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Setor de Origem</p>
              <p className="font-medium">{protocol.originSector?.name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Aberto por</p>
              <p className="font-medium">{protocol.createdBy?.name || '-'}</p>
            </div>
            {protocol.requesterName && (
              <div>
                <p className="text-gray-500">Requerente</p>
                <p className="font-medium">{protocol.requesterName}</p>
              </div>
            )}
            {protocol.requesterCpfCnpj && (
              <div>
                <p className="text-gray-500">CPF/CNPJ</p>
                <p className="font-medium">{protocol.requesterCpfCnpj}</p>
              </div>
            )}
            {protocol.dueDate && (
              <div>
                <p className="text-gray-500">Prazo</p>
                <p className="font-medium">{format(new Date(protocol.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Criado em</p>
              <p className="font-medium">{format(new Date(protocol.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
            </div>
          </div>

          {protocol.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-1">Descrição</p>
              <p className="text-sm text-gray-700">{protocol.description}</p>
            </div>
          )}
          {protocol.observations && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">Observações</p>
              <p className="text-sm text-gray-700">{protocol.observations}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tramitações</h2>
            <button
              onClick={() => setShowDispatch(!showDispatch)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              + Despachar
            </button>
          </div>

          {showDispatch && (
            <form onSubmit={handleSubmit(onDispatch)} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    {...register('type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="forward">Encaminhar</option>
                    <option value="dispatch">Despachar</option>
                    <option value="return">Devolver</option>
                    <option value="receive">Receber</option>
                    <option value="archive">Arquivar</option>
                    <option value="comment">Comentar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Para o Setor</label>
                  <select
                    {...register('toSectorId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecionar setor</option>
                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  {...register('observations')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Observações sobre a tramitação..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowDispatch(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={dispatching} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                  {dispatching ? 'Enviando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          )}

          <div className="relative">
            {movements.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">Nenhuma tramitação registrada</p>
            ) : (
              <div className="space-y-4">
                {movements.map((movement, idx) => (
                  <div key={movement.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                        {idx + 1}
                      </div>
                      {idx < movements.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-gray-900">
                          {MOVEMENT_TYPE_LABELS[movement.type] || movement.type}
                        </span>
                        {movement.fromSector && (
                          <span className="text-xs text-gray-500">de {movement.fromSector.name}</span>
                        )}
                        {movement.toSector && (
                          <span className="text-xs text-gray-500">→ {movement.toSector.name}</span>
                        )}
                      </div>
                      {movement.observations && (
                        <p className="text-sm text-gray-600 mt-1">{movement.observations}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {movement.fromUser?.name && `Por ${movement.fromUser.name} · `}
                          {format(new Date(movement.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
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

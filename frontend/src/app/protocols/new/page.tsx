'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Sector } from '@/types';

interface NewProtocolForm {
  subject: string;
  description: string;
  documentType: string;
  priority: string;
  isExternal: boolean;
  requesterName: string;
  requesterEmail: string;
  requesterCpfCnpj: string;
  requesterPhone: string;
  dueDate: string;
  originSectorId: string;
  currentSectorId: string;
  observations: string;
}

export default function NewProtocolPage() {
  const router = useRouter();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<NewProtocolForm>({
    defaultValues: { priority: 'normal', isExternal: false }
  });
  const isExternal = watch('isExternal');

  useEffect(() => {
    api.get('/sectors').then(res => setSectors(res.data)).catch(console.error);
  }, []);

  const onSubmit = async (data: NewProtocolForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/protocols', data);
      router.push(`/protocols/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar protocolo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">← Voltar</button>
          <h1 className="text-2xl font-bold text-gray-900">Novo Protocolo</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assunto *</label>
              <input
                {...register('subject', { required: 'Assunto é obrigatório' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Descreva o assunto do protocolo"
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
              <input
                {...register('documentType')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: Ofício, Requerimento, Memorando"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select
                {...register('priority')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setor Destino</label>
              <select
                {...register('currentSectorId')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Selecione um setor</option>
                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" {...register('isExternal')} className="rounded" />
                Protocolo Externo (cidadão)
              </label>
            </div>

            {isExternal && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Requerente</label>
                  <input
                    {...register('requesterName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
                  <input
                    {...register('requesterCpfCnpj')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail do Requerente</label>
                  <input
                    type="email"
                    {...register('requesterEmail')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    {...register('requesterPhone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Descrição detalhada do protocolo..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                {...register('observations')}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
              {loading ? 'Criando...' : 'Criar Protocolo'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

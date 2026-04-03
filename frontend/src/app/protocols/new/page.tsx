'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Sector } from '@/types';
import { ArrowLeft, FilePlus, Loader2, User, Info } from 'lucide-react';

const documentTypes = [
  { key: 'memorando',         label: 'Memorando' },
  { key: 'circular',          label: 'Circular' },
  { key: 'oficio',            label: 'Ofício' },
  { key: 'ato-oficial',       label: 'Ato Oficial' },
  { key: 'protocolo',         label: 'Protocolo' },
  { key: 'ouvidoria',         label: 'Ouvidoria' },
  { key: 'esic',              label: 'Pedido e-SIC' },
  { key: 'fiscalizacao',      label: 'Fiscalização' },
  { key: 'parecer',           label: 'Parecer' },
  { key: 'processo-adm',      label: 'Processo Administrativo' },
  { key: 'chamado',           label: 'Chamado Técnico' },
  { key: 'processo-seletivo', label: 'Processo Seletivo Simplificado' },
  { key: 'alvara',            label: 'Alvará' },
  { key: 'habite-se',         label: 'Habite-se' },
  { key: 'analise-projeto',   label: 'Análise de Projeto' },
  { key: 'certidao',          label: 'Certidão' },
];

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

function FormSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
        <Icon className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

export default function NewProtocolPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docType = searchParams.get('docType') ?? '';
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<NewProtocolForm>({
    defaultValues: { priority: 'normal', isExternal: false, documentType: docType }
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
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn-ghost py-1.5">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="page-title">Novo Protocolo</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="card p-6">
            <FormSection icon={Info} title="Informações Básicas">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Assunto <span className="text-red-500">*</span></label>
                <input
                  {...register('subject', { required: 'Assunto é obrigatório' })}
                  className="input-base"
                  placeholder="Descreva o assunto do protocolo"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Documento</label>
                <select {...register('documentType')} className="input-base">
                  <option value="">Selecione o tipo</option>
                  {documentTypes.map(dt => (
                    <option key={dt.key} value={dt.key}>{dt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Prioridade</label>
                <select {...register('priority')} className="input-base">
                  <option value="low">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Prazo</label>
                <input type="date" {...register('dueDate')} className="input-base" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Setor Destino</label>
                <select {...register('currentSectorId')} className="input-base">
                  <option value="">Selecione um setor</option>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input-base resize-none"
                  placeholder="Descrição detalhada do protocolo..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Observações</label>
                <textarea
                  {...register('observations')}
                  rows={2}
                  className="input-base resize-none"
                />
              </div>
            </FormSection>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">Requerente</h3>
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isExternal')}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Protocolo Externo (requerimento de cidadão)</span>
              </label>
            </div>
            {isExternal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Requerente</label>
                  <input {...register('requesterName')} className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">CPF/CNPJ</label>
                  <input {...register('requesterCpfCnpj')} className="input-base" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                  <input type="email" {...register('requesterEmail')} className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
                  <input {...register('requesterPhone')} className="input-base" placeholder="(00) 00000-0000" />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => router.back()} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Criando...</>
              ) : (
                <><FilePlus className="w-4 h-4" /> Criar Protocolo</>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

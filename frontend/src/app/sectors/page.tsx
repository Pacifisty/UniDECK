'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Sector } from '@/types';
import { useForm } from 'react-hook-form';
import { Building2, X, Loader2, Plus } from 'lucide-react';

interface SectorForm {
  name: string;
  code: string;
  description: string;
  organ: string;
  secretariat: string;
}

export default function SectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SectorForm>();

  const fetchSectors = async () => {
    try {
      const res = await api.get('/sectors');
      setSectors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSectors(); }, []);

  const onSubmit = async (data: SectorForm) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/sectors', data);
      reset();
      setShowForm(false);
      fetchSectors();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar setor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Setores</h1>
            <p className="text-sm text-slate-500 mt-1">
              {sectors.length} setor{sectors.length !== 1 ? 'es' : ''} cadastrado{sectors.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
            {showForm ? (
              <><X className="w-4 h-4" /> Cancelar</>
            ) : (
              <><Plus className="w-4 h-4" /> Novo Setor</>
            )}
          </button>
        </div>

        {showForm && (
          <div className="card p-6">
            <h2 className="section-title mb-4">Dados do Novo Setor</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome <span className="text-red-500">*</span></label>
                <input
                  {...register('name', { required: 'Nome é obrigatório' })}
                  className="input-base"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Código <span className="text-red-500">*</span></label>
                <input
                  {...register('code', { required: 'Código é obrigatório' })}
                  className="input-base"
                  placeholder="Ex: SEMAE, SEC-SAUDE"
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Órgão</label>
                <input {...register('organ')} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Secretaria</label>
                <input {...register('secretariat')} className="input-base" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
                <input {...register('description')} className="input-base" />
              </div>
              {error && (
                <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}
              <div className="md:col-span-2 flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                  ) : (
                    <><Building2 className="w-4 h-4" /> Criar Setor</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-slate-500">Carregando setores...</span>
            </div>
          ) : sectors.length === 0 ? (
            <div className="empty-state">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Building2 className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-medium text-slate-700">Nenhum setor cadastrado</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Órgão</th>
                  <th>Secretaria</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((sector) => (
                  <tr key={sector.id} className="table-row">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{sector.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded">{sector.code}</span>
                    </td>
                    <td><span className="text-sm text-slate-600">{sector.organ || '—'}</span></td>
                    <td><span className="text-sm text-slate-600">{sector.secretariat || '—'}</span></td>
                    <td>
                      <span className={`badge ${sector.isActive ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
                        {sector.isActive ? 'Ativo' : 'Inativo'}
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

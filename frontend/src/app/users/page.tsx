'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { User, Sector, ROLE_LABELS } from '@/types';
import { useForm } from 'react-hook-form';
import { UserPlus, X, Loader2, Users } from 'lucide-react';

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: string;
  cpf: string;
  position: string;
  sectorId: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>({
    defaultValues: { role: 'internal_user' }
  });

  const fetchData = async () => {
    try {
      const [usersRes, sectorsRes] = await Promise.all([
        api.get('/users'),
        api.get('/sectors'),
      ]);
      setUsers(usersRes.data.data);
      setSectors(sectorsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data: UserForm) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/users', data);
      reset();
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <MainLayout>
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Usuários</h1>
            <p className="text-sm text-slate-500 mt-1">
              {users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
            {showForm ? (
              <><X className="w-4 h-4" /> Cancelar</>
            ) : (
              <><UserPlus className="w-4 h-4" /> Novo Usuário</>
            )}
          </button>
        </div>

        {showForm && (
          <div className="card p-6">
            <h2 className="section-title mb-4">Dados do Novo Usuário</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome <span className="text-red-500">*</span></label>
                <input {...register('name', { required: 'Nome é obrigatório' })} className="input-base" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail <span className="text-red-500">*</span></label>
                <input type="email" {...register('email', { required: 'E-mail é obrigatório' })} className="input-base" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha <span className="text-red-500">*</span></label>
                <input type="password" {...register('password', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} className="input-base" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Perfil</label>
                <select {...register('role')} className="input-base">
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">CPF</label>
                <input {...register('cpf')} className="input-base" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cargo</label>
                <input {...register('position')} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Setor</label>
                <select {...register('sectorId')} className="input-base">
                  <option value="">Selecione um setor</option>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
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
                    <><UserPlus className="w-4 h-4" /> Criar Usuário</>
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
              <span className="text-sm text-slate-500">Carregando usuários...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Users className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-medium text-slate-700">Nenhum usuário cadastrado</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Setor</th>
                  <th>Cargo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td><span className="text-sm text-slate-600">{user.email}</span></td>
                    <td>
                      <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td><span className="text-sm text-slate-600">{user.sector?.name || '—'}</span></td>
                    <td><span className="text-sm text-slate-600">{user.position || '—'}</span></td>
                    <td>
                      <span className={`badge ${user.isActive ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
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

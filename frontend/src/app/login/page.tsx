'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { FileStack, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const googleAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.access_token, res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError('');
    if (!googleAuthUrl) {
      setError('Login com Google ainda não está configurado.');
      return;
    }
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
            <FileStack className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">UniDECK</h1>
          <p className="text-slate-400 text-sm mt-1">Sistema Municipal de Gestão Documental</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Entrar na conta</h2>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-slate-300 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition-colors mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-1.9 3.1l3.1 2.4c1.8-1.7 2.8-4.1 2.8-6.9 0-.7-.1-1.4-.2-2H12z" />
              <path fill="#34A853" d="M12 21c2.5 0 4.7-.8 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.2.9-2.5 0-4.5-1.7-5.3-4l-3.2 2.5C5 18.9 8.2 21 12 21z" />
              <path fill="#4A90E2" d="M6.7 13.2c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8L3.5 7.1C2.8 8.5 2.4 10 2.4 11.4s.4 2.9 1.1 4.3l3.2-2.5z" />
              <path fill="#FBBC05" d="M12 5.6c1.4 0 2.6.5 3.6 1.4l2.7-2.7C16.7 2.8 14.5 2 12 2 8.2 2 5 4.1 3.5 7.1l3.2 2.5c.8-2.3 2.8-4 5.3-4z" />
            </svg>
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-400 mb-5">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="uppercase tracking-wider">ou</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
              <input
                type="email"
                {...register('email', { required: 'E-mail é obrigatório' })}
                className="input-base"
                placeholder="seu@email.gov.br"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Senha é obrigatória' })}
                  className="input-base pr-10"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : 'Entrar'}
            </button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-6">
            Não tem conta?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Inscreva-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

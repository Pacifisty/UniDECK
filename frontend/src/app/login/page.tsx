'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      setError(err.response?.data?.message || 'Credenciais invalidas');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError('');

    if (!googleAuthUrl) {
      setError('Login com Google ainda nao esta configurado.');
      return;
    }

    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">UniDECK</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema Municipal de Gestao Documental</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg transition hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-1.9 3.1l3.1 2.4c1.8-1.7 2.8-4.1 2.8-6.9 0-.7-.1-1.4-.2-2H12z" />
              <path fill="#34A853" d="M12 21c2.5 0 4.7-.8 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.2.9-2.5 0-4.5-1.7-5.3-4l-3.2 2.5C5 18.9 8.2 21 12 21z" />
              <path fill="#4A90E2" d="M6.7 13.2c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8L3.5 7.1C2.8 8.5 2.4 10 2.4 11.4s.4 2.9 1.1 4.3l3.2-2.5z" />
              <path fill="#FBBC05" d="M12 5.6c1.4 0 2.6.5 3.6 1.4l2.7-2.7C16.7 2.8 14.5 2 12 2 8.2 2 5 4.1 3.5 7.1l3.2 2.5c.8-2.3 2.8-4 5.3-4z" />
            </svg>
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>ou</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              {...register('email', { required: 'E-mail e obrigatorio' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="seu@email.gov.br"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              {...register('password', { required: 'Senha e obrigatoria' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Digite sua senha"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Nao tem conta?{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Inscreva-se
          </Link>
        </p>
      </div>
    </div>
  );
}

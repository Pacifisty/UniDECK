'use client';
import MainLayout from '@/components/layout/MainLayout';
import { History } from 'lucide-react';

export default function HistricodeAtendimentoPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
          <History className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Histórico de Atendimento</h1>
        <p className="text-slate-500">Em breve</p>
      </div>
    </MainLayout>
  );
}

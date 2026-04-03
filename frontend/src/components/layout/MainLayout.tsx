'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import { isAuthenticated } from '@/lib/auth';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  if (!mounted) return null;
  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-14 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

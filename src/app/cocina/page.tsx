"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function CocinaRootPage() {
  const router = useRouter();
  const { activeUser } = useAuthStore();

  useEffect(() => {
    if (activeUser) {
      router.replace('/cocina/monitor-pedidos');
    } else {
      router.replace('/cocina/login');
    }
  }, [router, activeUser]);

  return null;
}

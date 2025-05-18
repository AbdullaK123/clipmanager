'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait for the session to load
    
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  return { session, status };
}
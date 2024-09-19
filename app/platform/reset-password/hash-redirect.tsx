'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const hashParams = new URLSearchParams(hash);
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      if (error && errorDescription) {
        router.replace(
          `/platform/reset-password?error=${error}&error_description=${errorDescription}`
        );
      }
    }
  }, [router]);

  return null;
}

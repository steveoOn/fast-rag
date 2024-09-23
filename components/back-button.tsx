'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  href: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function BackButton({ label = 'Back', href, size = 'icon' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <Button onClick={handleClick} size={size} variant="outline" className="flex items-center mb-4">
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

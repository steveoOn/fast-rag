'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

interface CopyButtonProps {
  content: string;
  successMessage?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function CopyButton({
  content,
  successMessage = '内容已复制到剪贴板',
  variant = 'ghost',
  size = 'icon',
  className,
}: CopyButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const t = useTranslations('Utils.CopyButton');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  if (!isMounted) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast({
        title: t('success'),
        description: successMessage,
      });
    } catch (err) {
      console.error(t('error'), err);
      toast({
        title: t('error'),
        description: t('manualCopy'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={!content}
      className={className}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

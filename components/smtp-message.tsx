import { ArrowUpRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';

interface SmtpMessageProps {
  message: string;
  linkText?: string;
  linkHref?: string;
}

export function SmtpMessage({ message, linkText, linkHref }: SmtpMessageProps) {
  return (
    <div className="bg-muted/50 px-5 py-3 border rounded-md flex gap-4 max-w-64">
      <InfoIcon size={16} className="mt-0.5" />
      <div className="flex flex-col gap-1">
        <small className="text-sm text-secondary-foreground">
          <strong>Note:</strong> {message}
        </small>
        {linkText && linkHref && (
          <div>
            <Link
              href={linkHref}
              target="_blank"
              className="text-primary/50 hover:text-primary flex items-center text-sm gap-1"
            >
              {linkText} <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

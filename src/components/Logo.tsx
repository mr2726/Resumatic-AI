import { FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const textSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl';
  const iconSizeClass = size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-6 w-6' : 'h-7 w-7';

  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <FileText className={cn(iconSizeClass, "text-primary group-hover:text-accent transition-colors")} />
      <h1 className={cn("font-headline font-bold", textSize, "text-foreground group-hover:text-accent transition-colors")}>
        Resumatic AI
      </h1>
    </Link>
  );
}

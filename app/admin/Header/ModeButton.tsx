'use client';

import { cn } from '@/lib/cn';

interface ModeButtonProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function ModeButton({ isSelected, name, onClick }: ModeButtonProps) {
  return (
    <button 
      type='button' 
      className='group relative flex h-full items-center justify-center px-2 transition-all outline-none' 
      onClick={onClick}
    >
      <span
        className={cn(
          'text-lg font-medium transition-all duration-200',
          'text-slate-400 group-hover:text-slate-600',
          isSelected && 'font-bold text-sky-500'
        )}
      >
        {name}
      </span>

      <div
        className={cn(
          'absolute bottom-0 h-1 w-full rounded-t-full transition-all duration-300',
          'scale-x-0 bg-slate-200 group-hover:scale-x-100',
          isSelected && 'scale-x-100 bg-sky-500'
        )}
      />
    </button>
  );
}
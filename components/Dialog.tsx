'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
  zIndex?: number;
}

export default function Dialog({
  children,
  className,
  closeOnOutsideClick = true,
  description,
  isOpen,
  onClose,
  title,
  zIndex = 2100,
}: DialogProps) {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={cn('top-0, fixed, left-0, w-svw, h-svh, inset-0 bg-[rgba(0,0,0,0.7)]')} style={{ zIndex, position: "fixed" }} />
        <RadixDialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl outline-none',
            className,
          )}
          style={{ zIndex: zIndex + 1 }}
          onPointerDownOutside={(e) => {
            if (!closeOnOutsideClick) {
              e.preventDefault();
            }
          }}
        >
          <RadixDialog.Title className='sr-only'>{title || 'Modal'}</RadixDialog.Title>
          <RadixDialog.Description className='sr-only'>{description || 'Modal Content'}</RadixDialog.Description>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

'use client';

import { ModeType } from '@/types/user';
import ModeButton from './ModeButton';

interface HeaderProps {
  currentMode: ModeType;
  onChangeMode: (value: ModeType) => void;
}

interface ButtonProps {
  name: string;
  mode: ModeType;
}

export default function Header({ currentMode, onChangeMode }: HeaderProps) {
  const MODE_BUTTONS: ButtonProps[] = [
    { mode: 'addReservation', name: '예약하기' },
    { mode: 'myReservation', name: '예약 조회하기' },
    {mode: 'rank', name: '주간 테마'}
  ];

  return (
    <header className='flex h-16 w-full items-center gap-8 border-b border-gray-100 bg-white px-8 shadow-sm'>
      <nav className='flex h-full items-center gap-6'>
        {MODE_BUTTONS.map(({ mode, name }) => (
          <ModeButton 
            isSelected={currentMode === mode} 
            key={mode} 
            name={name} 
            onClick={() => onChangeMode(mode)} 
          />
        ))}
      </nav>
    </header>
  );
}
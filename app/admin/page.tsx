'use client';

import { useCallback, useState } from 'react';

import Header from './Header';
import ThemeContent from './ThemeContent';
import TimeContent from './TimeContent';

import { ModeType } from '@/types/admin';
import ReservationContent from './ReservationContent';

export default function Admin() {
  const [mode, setMode] = useState<ModeType>('time');

  const handleChaneMode = useCallback((value: ModeType) => {
    setMode(value);
  }, []);

  return (
    <div className='flex flex-1 flex-col'>
      <Header currentMode={mode} onChangeMode={handleChaneMode} />
      <div className='flex flex-1'>{mode === 'time' ? <TimeContent /> : mode === 'theme' ? <ThemeContent /> : <ReservationContent />}</div>
    </div>
  );
}

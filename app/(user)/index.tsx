'use client';

import { useCallback, useState } from "react";
import Header from "./Header";
import { ModeType } from "@/types/user";
import AddReservation from "./addReservation";
import Reservation from "./reservation";
import Rank from "./rank";

export default function User() {
  const [mode, setMode] = useState<ModeType>("addReservation");

  const handleChaneMode = useCallback((value: ModeType) => {
    setMode(value);
  }, [])

  return (
    <div className='flex flex-1 flex-col'>
      <Header currentMode={mode} onChangeMode={handleChaneMode} />
      <div className='flex flex-1'>
        {mode === "addReservation" ? (
          <div className="flex flex-1 p-10 bg-slate-50/50">
            <div className="flex flex-1 max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <AddReservation />
            </div>
          </div>
        ) : mode === 'myReservation' ? <Reservation /> : <Rank />}
      </div>
    </div>
  );
}
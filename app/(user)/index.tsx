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
      <div className='flex flex-1'>{mode === "addReservation" ? <AddReservation /> : mode === 'myReservation' ? <Reservation /> : <Rank/>}</div>
    </div>
  );
}
'use client';

import { deleteTime, getAllTime } from "@/api/time";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import AddContent from "../AddItem";
import Dialog from "@/components/Dialog";
import TimeItem from "./TimeItem";
import TimeAddDialogContent from "./TimeAddDialogContent";
import { cn } from "@/lib/cn";

export default function TimeContent() {
  const [selectedItem, setSelectedItem] = useState<TimeData | null>(null);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data = [], isPending, isError } = useQuery({ 
    queryKey: ["time"], 
    queryFn: getAllTime 
  });

  const { mutate: deleteTimeMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteTime, 
    onSuccess: () => {
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ["time"] });
    },
    onError: () => {
      alert("시간 삭제에 실패하였습니다.");
    }
  });

  const handleItemClick = useCallback((value: TimeData) => {
    setSelectedItem(value);
  }, []);

  const handleAddItemClick = useCallback(() => {
    setIsOpenAddDialog(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleAddDialogClose = useCallback(() => {
    setIsOpenAddDialog(false);
  }, []);

  const handleDeleteButton = () => {
    if (!selectedItem) return;
    if (confirm(`${selectedItem.startAt} 타임을 삭제하시겠습니까?`)) {
      deleteTimeMutate(selectedItem.id);
    }
  };

  if (isPending) return <div className="flex flex-1 items-center justify-center font-bold text-slate-400">Loading...</div>;
  if (isError) throw new Error("시간 데이터를 불러오는데 실패했습니다.");

  return (
    <div className='flex flex-1 flex-col p-10 bg-slate-50/50 min-h-screen'>
      <div className="max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">TIME MANAGEMENT</h1>
          <p className="text-slate-500 mt-1">예약 가능한 시간대 목록을 관리합니다.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          <AddContent onClick={handleAddItemClick} className="h-21" />
          {data.map((item: TimeData) => (
            <TimeItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
          ))}
        </div>
      </div>

      {/* 상세 및 삭제 다이얼로그 */}
      <Dialog isOpen={selectedItem !== null} onClose={handleDialogClose} className="rounded-3xl shadow-2xl border-none overflow-hidden">
        <div className="relative w-80 bg-white">
          <header className="p-6 text-center border-b border-slate-50">
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Selected Time</span>
            <div className="text-5xl font-black text-slate-800 mt-2 tracking-tighter">
              {selectedItem?.startAt}
            </div>
          </header>

          <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors" onClick={handleDialogClose}>
            <span className="text-xl font-bold">✕</span>
          </button>

          <div className="p-6 space-y-3">
            <button 
              disabled={isDeleting} 
              className={cn(
                "w-full h-14 rounded-2xl font-bold transition-all flex items-center justify-center",
                "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
              )} 
              onClick={handleDeleteButton}
            >
              {isDeleting ? "삭제 중..." : "시간 삭제하기"}
            </button>
            <button 
              className="w-full h-14 rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-all"
              onClick={handleDialogClose}
            >
              취소
            </button>
          </div>
        </div>
      </Dialog>

      {/* 시간 추가 다이얼로그 */}
      <Dialog isOpen={isOpenAddDialog} onClose={handleAddDialogClose} className="rounded-3xl shadow-2xl border-none overflow-hidden">
        <TimeAddDialogContent onClose={handleAddDialogClose} />
      </Dialog>
    </div>
  );
}
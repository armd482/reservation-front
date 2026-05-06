'use client';

import { addTime } from "@/api/time";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface AddTimeRequest {
  startAt: string;
}

interface TimeAddDialogContentProps {
  onClose: () => void;
}

export default function TimeAddDialogContent({ onClose }: TimeAddDialogContentProps) {
  const queryClient = useQueryClient();

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const { register, handleSubmit, formState: { errors } } = useForm<AddTimeRequest>({
    defaultValues: { startAt: getCurrentTime() }
  });

  const { isPending, mutate: addTimeMutate } = useMutation({ 
    mutationFn: addTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time'] });
      onClose();
    }
  });

  const onSubmit = (data: AddTimeRequest) => {
    const [hours, minutes] = data.startAt.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    addTimeMutate({ startAt: formattedTime });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-80 bg-white">
      <div className="p-8 space-y-6">
        <header>
          <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">ADD TIME</h2>
          <p className="text-slate-400 text-sm mt-1">새로운 운영 시간을 등록합니다.</p>
        </header>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-slate-700 ml-1 uppercase tracking-wider">Start Time</label>
          <input 
            type="time"
            step={60}
            {...register("startAt", { required: "시간을 선택해주세요." })}
            className="w-full h-14 border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-0 outline-none transition-all font-bold text-xl"
          />
          {errors.startAt && (
            <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.startAt.message}</span>
          )}
        </div>
      </div>

      <footer className="p-8 bg-slate-50 flex gap-3">
        <button 
          type="button" 
          onClick={onClose}
          className="flex-1 h-12 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold hover:bg-slate-100 transition-all"
        >
          취소
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="flex-[1.5] h-12 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:bg-blue-300"
        >
          {isPending ? "추가 중..." : "저장하기"}
        </button>
      </footer>
    </form>
  );
}
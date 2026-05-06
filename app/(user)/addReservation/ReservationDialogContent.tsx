'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReservation } from "@/api/reservation";
import { AddReservationRequest } from "@/types/reservation";
import { UseFormReturn } from "react-hook-form";

interface ReservationDialogContentProps {
  date: string;
  theme: ThemeData;
  time: TimeData;
  onClose: () => void;
  formMethods: UseFormReturn<AddReservationRequest>; // 타입 지정
}

export default function ReservationDialogContent({ 
  date, 
  theme, 
  time, 
  onClose, 
  formMethods 
}: ReservationDialogContentProps) {
  
  const { register, handleSubmit, formState: { errors } } = formMethods;
  const queryClient = useQueryClient();

  const { mutate: reserve, isPending } = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      alert("예약이 완료되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["availableTimes", date, theme.id] });
      onClose();
    }
  });

  const onSubmit = (data: AddReservationRequest) => {
    reserve({
      date,
      themeId: theme.id,
      timeId: time.id,
      name: data.name
    });
  };

  return (
    <div className="p-8 w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">예약 확인</h2>
      
      <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex flex-col gap-2 shadow-inner">
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">테마</span>
          <span className="font-bold">{theme.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">날짜</span>
          <span className="font-bold">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">시간</span>
          <span className="font-bold text-blue-600">{time.startAt}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold ml-1 text-gray-700">예약자 성함</label>
          <input 
            {...register("name", { required: "성함을 입력해주세요." })}
            placeholder="실명을 입력하세요"
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            취소
          </button>
          <button 
            type="submit" 
            disabled={isPending}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-md"
          >
            {isPending ? "처리중..." : "예약 확정"}
          </button>
        </div>
      </form>
    </div>
  );
}
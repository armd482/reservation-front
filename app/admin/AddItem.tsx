"use client";

import { cn } from "@/lib/cn";

interface AddContentProps {
  onClick: () => void;
  className?: string;
}

export default function AddContent({ onClick, className }: AddContentProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center w-full h-full", 
        "rounded-2xl border-2 border-dashed transition-all duration-200",
        "border-slate-200 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-400",
        className
      )}
    >
      <div className="relative flex flex-col items-center gap-3">
        {/* 아이콘 크기를 살짝 줄여 작은 카드(시간 관리)에서도 깨지지 않게 조정 */}
        <div className={cn(
          "flex items-center justify-center size-12 rounded-xl border-2 border-slate-300",
          "bg-white text-slate-400 transition-all duration-300",
          "group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:rotate-90"
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-6 stroke-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>
    </button>
  );
}
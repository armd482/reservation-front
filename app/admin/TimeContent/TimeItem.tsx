'use client';

import { cn } from "@/lib/cn";

interface TimeItemProps {
  item: TimeData;
  onClick: () => void;
  isSelected?: boolean;
  isAvailable?: boolean;
}

export default function TimeItem({ item, onClick, isSelected, isAvailable }: TimeItemProps) {
  return (
    <button 
      type="button"
      className="group w-full outline-none h-full" 
      disabled={isAvailable === false}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center justify-center px-8 py-6 rounded-2xl border-2 transition-all duration-200",
        "bg-white text-2xl font-black tracking-tight shadow-sm",
        "border-slate-100 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md hover:-translate-y-1",
        isSelected && "border-blue-500 bg-blue-50 text-blue-600",
        isAvailable === false && "opacity-20"
      )}>
        {item.startAt}
      </div>
    </button>
  )
}
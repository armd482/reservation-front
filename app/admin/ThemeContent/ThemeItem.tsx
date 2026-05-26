'use client';

import { cn } from "@/lib/cn";
import Image from "next/image";

interface ThemeItemProps {
  value: ThemeData;
  onClick: () => void;
  isSelected?: boolean;
}

export default function ThemeItem({ value, onClick, isSelected }: ThemeItemProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="group relative w-full focus:outline-none"
    >
      <div className={cn(
        "flex flex-col w-full h-100 rounded-3xl overflow-hidden bg-white transition-all duration-300",
        "border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2",
        isSelected && "ring-4 ring-blue-500 border-transparent z-10"
      )}>
        {/* 이미지 섹션 */}
        <div className="relative w-full h-52 overflow-hidden bg-slate-100">
          <Image 
            src={value.url} 
            alt={value.name}
            fill
            // 뷰포트에 따른 이미지 최적화 크기 지정
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={true}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 정보 섹션 */}
        <div className="flex flex-1 flex-col p-6 text-left min-h-0">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
            THEME ID: {value.id}
          </span>
          <h3 className="text-xl font-bold text-slate-800 mb-3 truncate group-hover:text-blue-600 transition-colors shrink-0">
            {value.name}
          </h3>
          
          {/* 이 부분이 핵심입니다 */}
          <div className="flex-1 min-h-0"> 
            <p className={cn(
              "text-sm text-slate-500 leading-relaxed wrap-break-word whitespace-pre-wrap",
              "line-clamp-4"
            )}>
              {value.description}
            </p>
          </div>
        </div>
      </div>

      {/* 선택 상태 뱃지 */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl border-4 border-white animate-in zoom-in duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}
'use client';

import { useQuery } from "@tanstack/react-query";
import { getPopularTheme } from "@/api/theme";
import { cn } from "@/lib/cn";
import ThemeItem from "../admin/ThemeContent/ThemeItem";
import { useState, useCallback } from "react";
import Dialog from "@/components/Dialog";
import ThemeItemDialogContent from "../admin/ThemeContent/ThemeItemDialogContent";

export default function Rank() {
  const [selectedItem, setSelectedItem] = useState<ThemeData | null>(null);

  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dateRange = `${lastWeek.toLocaleDateString()} ~ ${new Date(today.getTime()).toLocaleDateString()}`;

  const { data: popularThemes = [], isPending } = useQuery({
    queryKey: ["themes", "popular"],
    queryFn: getPopularTheme,
  });

  const handleItemClick = useCallback((theme: ThemeData) => {
    setSelectedItem(theme);
  }, []);

  const handleDialogClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  if (isPending) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col p-10 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <header className="mb-12 border-l-8 border-blue-500 pl-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">TOP 10 THEMES</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            최근 1주일간 가장 뜨거웠던 테마 순위 <span className="text-blue-600">({dateRange})</span>
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {popularThemes.map((theme, index) => (
            <div key={theme.id} className="relative group">
              <div className={cn(
                "absolute -top-4 -left-4 z-20 w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-lg rotate-[-10deg] transition-transform group-hover:rotate-0",
                index < 3 ? "bg-blue-600 text-white scale-110" : "bg-white text-slate-400 border border-slate-200"
              )}>
                {index + 1}
              </div>
              
              <ThemeItem value={theme} onClick={() => handleItemClick(theme)} />

              <div className="mt-4 text-center">
                <span className="inline-block px-4 py-1 bg-white border border-blue-100 text-blue-600 rounded-full text-xs font-bold shadow-sm">
                  주간 예약 {theme.count}건
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog 
        isOpen={selectedItem !== null} 
        onClose={handleDialogClose} 
        className="rounded-3xl max-w-2xl w-full p-0 overflow-hidden border-none shadow-2xl"
      >
        <div className="relative flex flex-col max-h-[90vh] bg-white">
          <button 
            className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-md" 
            onClick={handleDialogClose}
          >
            <span className="text-xl font-bold text-white">✕</span>
          </button>

          <div className="overflow-y-auto">
            {selectedItem && <ThemeItemDialogContent item={selectedItem} />}
          </div>

          <div className="p-6 bg-slate-50 border-t">
            <button 
              className="w-full h-14 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              onClick={handleDialogClose}
            >
              확인
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
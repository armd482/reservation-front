'use client';

import { deleteTheme, getAllTheme } from "@/api/theme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ThemeItem from "./ThemeItem";
import { useCallback, useState } from "react";
import AddContent from "../AddItem";
import Dialog from "@/components/Dialog";
import ThemeItemDialogContent from "./ThemeItemDialogContent";
import ThemeAddDialogContent from "./ThemeAddDialogContent";
import { cn } from "@/lib/cn";

export default function ThemeContent() {
  const [selectedItem, setSelectedItem] = useState<ThemeData | null>(null);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data = [], isPending, isError } = useQuery({
    queryKey: ["theme"], 
    queryFn: getAllTheme
  });

  const { mutate: deleteThemeMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteTheme, 
    onSuccess: () => {
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ["theme"] });
    },
    onError: () => {
      alert("테마 삭제에 실패하였습니다.");
    }
  });

  const handleItemClick = useCallback((value: ThemeData) => {
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
    if (selectedItem == null) return;
    if (confirm(`'${selectedItem.name}' 테마를 정말 삭제하시겠습니까?`)) {
      deleteThemeMutate(selectedItem.id);
    }
  };

  if (isPending) return (
    <div className="flex flex-1 items-center justify-center min-h-100">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isError) throw new Error("데이터를 불러오는 중 오류가 발생했습니다.");

  return (
    <div className='flex flex-1 flex-col p-10 bg-slate-50/50'>
      <div className="max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">테마 관리</h1>
          <p className="text-slate-500 mt-2 text-lg">등록된 테마를 확인하거나 새로운 테마를 추가할 수 있습니다.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          <AddContent onClick={handleAddItemClick} className="h-100"/>
          {data.map((item: ThemeData) => (
            <ThemeItem 
              key={item.id} 
              value={item} 
              onClick={() => handleItemClick(item)}
            />
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
            <span className="text-xl">✕</span>
          </button>

          <div className="overflow-y-auto">
            {selectedItem && <ThemeItemDialogContent item={selectedItem} />}
          </div>

          <div className="p-6 bg-slate-50 border-t flex gap-4">
            <button 
              className="flex-1 h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all"
              onClick={handleDialogClose}
            >
              닫기
            </button>
            <button 
              disabled={isDeleting} 
              className={cn(
                "flex-[1.5] h-14 rounded-2xl font-bold flex items-center justify-center transition-all",
                "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-sm shadow-red-100",
                isDeleting && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleDeleteButton}
            >
              {isDeleting ? "삭제 중..." : "테마 삭제하기"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog 
        isOpen={isOpenAddDialog} 
        onClose={handleAddDialogClose} 
        className="rounded-3xl shadow-2xl border-none overflow-hidden"
      >
        <ThemeAddDialogContent onClose={handleAddDialogClose} />
      </Dialog>
    </div>
  );
}
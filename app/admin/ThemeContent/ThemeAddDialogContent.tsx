'use client';

import { getImageUrl } from "@/api/image";
import { addTheme } from "@/api/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/cn";

interface ThemeAddDialogContentProps {
  onClose: () => void;
}

export default function ThemeAddDialogContent({ onClose }: ThemeAddDialogContentProps) {
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AddThemeRequest>({
    defaultValues: { name: '', description: '', imageUrl: '' }
  });

  const { mutate: addThemeMutate, isPending } = useMutation({
    mutationFn: addTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme'] });
      onClose();
    },
    onError: () => {
      alert("테마 추가에 실패하였습니다.");
    }
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const onSubmit = async (data: AddThemeRequest) => {
    if (!selectedFile || isUploading) {
      alert("썸네일 이미지를 선택해 주세요.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
      const imageUrl = await getImageUrl(formData);
      addThemeMutate({ ...data, imageUrl });
    } catch {
      alert("이미지 업로드에 실패하였습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-125 max-w-full bg-white">
      <div className="p-8 space-y-6">
        <header>
          <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">NEW THEME</h2>
          <p className="text-slate-400 text-sm mt-1">새로운 테마 정보를 입력하세요.</p>
        </header>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-slate-700 ml-1 italic">01. Theme Name</label>
            <input 
              {...register("name", { required: "테마 이름을 입력해 주세요." })}
              className="h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 outline-none transition-all font-bold"
              placeholder="테마명을 입력하세요"
            />
            {errors.name && <span className="text-red-500 text-xs font-medium ml-1">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-slate-700 ml-1 italic">02. Description</label>
            <textarea 
              {...register("description", { required: "설명을 입력해 주세요." })}
              className="h-32 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 outline-none transition-all resize-none leading-relaxed"
              placeholder="테마에 대한 상세 설명을 입력하세요"
            />
            {errors.description && <span className="text-red-500 text-xs font-medium ml-1">{errors.description.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-slate-700 ml-1 italic">03. Thumbnail</label>
            <div className="group relative w-full h-44 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-500 transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <span className="text-3xl mb-1">+</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Upload Image</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="p-8 bg-slate-50 flex gap-3">
        <button 
          type="button" 
          onClick={onClose}
          className="flex-1 h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all"
          disabled={isPending || isUploading}
        >
          취소
        </button>
        <button 
          type="submit" 
          disabled={isPending || isUploading}
          className="flex-[1.5] h-14 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:bg-blue-300"
        >
          {isUploading ? "이미지 업로드 중..." : isPending ? "저장 중..." : "등록 완료"}
        </button>
      </footer>
    </form>
  );
}
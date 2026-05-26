'use client';

import Image from "next/image";

interface ThemeItemDialogContentProps {
  item: ThemeData;
}

export default function ThemeItemDialogContent({ item }: ThemeItemDialogContentProps) {
  return (
    <div className="flex flex-col w-full bg-white">      
      <div className="relative w-full h-112.5 bg-slate-900">
        <Image
          src={item.url}
          alt={item.name}
          fill
          className="object-cover opacity-80"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <span className="text-blue-400 font-black tracking-widest text-xs uppercase italic">Theme Overview</span>
          <h1 className="text-5xl font-black text-white mt-2 tracking-tighter leading-tight">
            {item.name}
          </h1>
        </div>
      </div>

      <div className="p-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-0.5 w-12 bg-blue-500" />
          <span className="font-black text-slate-300 italic">DESCRIPTION</span>
        </div>
        <p className="text-slate-600 text-xl leading-relaxed whitespace-pre-wrap font-medium">
          {item.description}
        </p>
      </div>
    </div>
  );
}
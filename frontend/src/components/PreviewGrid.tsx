'use client';

import React from 'react';
import { FileItem } from '../types/ocr';

interface PreviewGridProps {
  files: FileItem[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  removeFile: (id: string, index: number) => void;
  onAddMoreClick: () => void;
}

export const PreviewGrid: React.FC<PreviewGridProps> = ({
  files,
  activeTab,
  setActiveTab,
  removeFile,
  onAddMoreClick,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider">รายการรูปภาพที่เลือก:</h3>
      <div className="grid grid-cols-4 gap-2">
        {files.map((fileItem, idx) => (
          <div 
            key={fileItem.id} 
            onClick={() => setActiveTab(idx)}
            className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer border shadow-md transition-all duration-200 ${
              activeTab === idx 
                ? 'border-teal-400 ring-2 ring-teal-400/25 scale-[0.98]' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileItem.previewUrl}
              alt={fileItem.file.name}
              className="w-full h-full object-cover"
            />
            {/* overlay delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile(fileItem.id, idx);
              }}
              className="absolute top-1 right-1 p-1 bg-red-650 hover:bg-red-600 rounded-full text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
              title="ลบรูป"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}

        {/* Add more button thumbnail */}
        {files.length < 10 && (
          <button
            onClick={onAddMoreClick}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-slate-750 rounded-xl hover:bg-slate-900/40 transition-all duration-200 text-slate-500 hover:text-teal-400"
            title="เพิ่มรูปภาพ"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
            </svg>
            <span className="text-[9px] font-bold">เพิ่มรูป</span>
          </button>
        )}
      </div>
    </div>
  );
};

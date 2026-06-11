'use client';

import React from 'react';

interface UploadAreaProps {
  filesCount: number;
  dragActive: boolean;
  isLoading: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  filesCount,
  dragActive,
  isLoading,
  onDrag,
  onDrop,
  onFileSelect,
  onSubmit,
  fileInputRef,
}) => {
  return (
    <div className="space-y-6">
      {/* Drag & Drop Area */}
      <div
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onDrag}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] ${
          dragActive
            ? 'border-teal-400 bg-teal-950/20 scale-[0.98]'
            : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850/10'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileSelect}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="p-2.5 bg-slate-800/50 rounded-full inline-block group-hover:scale-110 group-hover:bg-slate-800 group-hover:text-teal-400 transition-all duration-300">
            <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">
              ลากรูปภาพหลายไฟล์มาวางที่นี่ หรือ <span className="text-teal-400 underline decoration-teal-400/30">คลิกเพื่อเลือกไฟล์</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">รองรับ PNG, JPG, JPEG (จำกัดสูงสุด 10 รูปพร้อมกัน)</p>
          </div>
        </div>
      </div>

      {/* Action Submit Button */}
      <div className="pt-4 border-t border-slate-800/60">
        <button
          onClick={onSubmit}
          disabled={filesCount === 0 || isLoading}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.98] ${
            filesCount === 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : isLoading
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 cursor-wait'
              : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/10'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังประมวลผล OCR ทั้งหมด {filesCount} รูป...
            </>
          ) : (
            <>
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              ดึงข้อความจาก {filesCount} รูปภาพพร้อมกัน
            </>
          )}
        </button>
      </div>
    </div>
  );
};

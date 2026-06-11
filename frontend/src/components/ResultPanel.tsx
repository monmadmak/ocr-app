'use client';

import React from 'react';
import { FileItem, OCRResult } from '../types/ocr';

interface ResultPanelProps {
  files: FileItem[];
  results: OCRResult[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  isLoading: boolean;
  isCopied: boolean;
  onCopyClick: (text: string) => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  files,
  results,
  activeTab,
  setActiveTab,
  isLoading,
  isCopied,
  onCopyClick,
}) => {
  const activeResult = results[activeTab];
  const activeFile = files[activeTab];

  const activeTextResult = activeResult
    ? activeResult.status === 'success'
      ? activeResult.text || 'ไม่พบข้อความในรูปภาพนี้'
      : `[ข้อผิดพลาด] ${activeResult.message || 'ไม่สามารถดึงข้อมูลข้อความได้'}`
    : '';

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6">
      <div className="flex-1 flex flex-col">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-teal-400 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-teal-400"></span>
            2. ผลลัพธ์ข้อมูลข้อความที่ดึงได้
          </h2>
          
          {activeTextResult && (
            <button
              onClick={() => onCopyClick(activeTextResult)}
              className={`text-xs py-1.5 px-3 rounded-lg border font-semibold flex items-center gap-1.5 transition-all duration-250 active:scale-95 ${
                isCopied
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-850 hover:border-slate-600 text-slate-300'
              }`}
            >
              {isCopied ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        {/* Tab Navigation for Results */}
        {results.length > 0 ? (
          <div className="flex border-b border-slate-800/80 mb-3 overflow-x-auto gap-1.5 pb-2 scrollbar-thin">
            {results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border whitespace-nowrap transition-all duration-200 ${
                  activeTab === idx
                    ? 'bg-teal-500 text-slate-950 border-teal-500 font-extrabold shadow-md shadow-teal-500/10'
                    : res.status === 'error'
                    ? 'bg-red-950/20 border-red-900/40 text-red-400 hover:bg-red-950/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {res.filename}
              </button>
            ))}
          </div>
        ) : files.length > 0 ? (
          <div className="flex border-b border-slate-800/80 mb-3 overflow-x-auto gap-1.5 pb-2 scrollbar-thin">
            {files.map((fileItem, idx) => (
              <button
                key={fileItem.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border whitespace-nowrap transition-all duration-200 ${
                  activeTab === idx
                    ? 'bg-slate-800 text-slate-100 border-slate-600 font-extrabold'
                    : 'bg-slate-900/20 border-slate-900 text-slate-600 hover:text-slate-400'
                }`}
              >
                {fileItem.file.name}
              </button>
            ))}
          </div>
        ) : null}

        {/* Active Preview Thumbnail inside Result section */}
        {activeFile && (
          <div className="mb-3 flex items-center gap-3 bg-slate-950/40 border border-slate-800 p-2.5 rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeFile.previewUrl} 
              alt="Active thumbnail" 
              className="w-10 h-10 object-cover rounded-lg border border-slate-800"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-300 truncate">{activeFile.file.name}</p>
              <p className="text-[10px] text-slate-500">{(activeFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}

        {/* Textarea container */}
        <div className="relative flex-1 min-h-[200px] flex flex-col">
          <textarea
            value={activeTextResult}
            readOnly
            placeholder={
              isLoading 
                ? 'กำลังประมวลผลคำขอ OCR กรุณารอสักครู่...' 
                : 'ผลลัพธ์ข้อความจากการสแกนของรูปภาพที่เลือกจะแสดงขึ้นที่นี่...'
            }
            className="w-full flex-1 p-4 bg-slate-950 border border-slate-800/80 hover:border-slate-700/60 focus:border-teal-500 rounded-2xl resize-none text-slate-300 placeholder-slate-600 focus:outline-none transition-all duration-300 text-sm font-mono leading-relaxed"
          />
        </div>
      </div>
      
      <div className="text-xs text-slate-500 pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <span>
          Status:{' '}
          {isLoading 
            ? 'Processing...' 
            : results.length > 0 
            ? `Done (${results.filter(r => r.status === 'success').length}/${results.length} Success)` 
            : 'Idle'}
        </span>
        {activeTextResult && activeResult?.status === 'success' && (
          <span>ตัวอักษร: {activeTextResult.length} ตัว</span>
        )}
      </div>
    </div>
  );
};

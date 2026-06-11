'use client';

import React, { useState, useRef } from 'react';
import { FileItem, OCRResult } from '../types/ocr';
import { ApiSettings } from '../components/ApiSettings';
import { UploadArea } from '../components/UploadArea';
import { PreviewGrid } from '../components/PreviewGrid';
import { ResultPanel } from '../components/ResultPanel';

export default function OCRPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [results, setResults] = useState<OCRResult[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // API Endpoint (ระบบแปรผันตาม Env หรือ Fallback พอร์ต 3000 ของ Backend)
  const [apiUrl, setApiUrl] = useState<string>(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1/ocr'
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // การจัดการ Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Helper สำหรับการตรวจสอบและเพิ่มไฟล์รูปภาพ
  const addFiles = (selectedFiles: FileList) => {
    const newFiles: FileItem[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type.match('image.*')) {
        // จำกัดการอัปโหลดสูงสุด 10 ไฟล์พร้อมกัน
        if (files.length + newFiles.length >= 10) {
          alert('จำกัดการอัปโหลดสูงสุด 10 รูปพร้อมกันเท่านั้น');
          break;
        }
        newFiles.push({
          id: `${Date.now()}-${Math.random()}-${file.name}`,
          file: file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    }
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      setResults([]); // ล้างผลลัพธ์เก่าเมื่อมีการเพิ่มไฟล์ใหม่
    }
  };

  // การจัดการ Drop File
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  // การจัดการการเลือกไฟล์ผ่านคลิกปกติ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  // ลบไฟล์ที่ไม่ต้องการออกจากคิว
  const removeFile = (id: string, index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return updated;
    });

    setResults((prev) => {
      if (prev.length > index) {
        const updatedResults = [...prev];
        updatedResults.splice(index, 1);
        return updatedResults;
      }
      return prev;
    });

    if (activeTab >= files.length - 1 && activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  // ล้างไฟล์ทั้งหมดเพื่อเริ่มใหม่
  const clearAllFiles = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setResults([]);
    setActiveTab(0);
    setIsCopied(false);
  };

  // กดยิง API แบบกลุ่ม
  const handleExtractText = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setResults([]);
    setIsCopied(false);
    setActiveTab(0);

    const formData = new FormData();
    files.forEach((fileItem) => {
      formData.append('images', fileItem.file);
    });

    try {
      console.log(`กำลังส่งรูปภาพ ${files.length} รูปไปประมวลผลที่: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการประมวลผล OCR');
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else if (data.text) {
        setResults([{
          filename: files[0].file.name,
          status: 'success',
          text: data.text
        }]);
      } else {
        throw new Error('ไม่พบข้อมูลผลลัพธ์การประมวลผลกลับมา');
      }
    } catch (error: any) {
      console.error(error);
      setResults(files.map(f => ({
        filename: f.file.name,
        status: 'error',
        message: error.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
      })));
    } finally {
      setIsLoading(false);
    }
  };

  // คัดลอกข้อความ
  const handleCopyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('คัดลอกไม่สำเร็จ:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-teal-500/30 selection:text-teal-300">
      <div className="max-w-4xl w-full space-y-6">
        
        {/* Settings Bar */}
        <div className="flex justify-between items-center">
          <div>
            {files.length > 0 && (
              <button 
                onClick={clearAllFiles}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 bg-slate-900/60 border border-slate-800 py-1.5 px-3 rounded-full transition-all duration-300"
              >
                ล้างไฟล์ทั้งหมด ({files.length})
              </button>
            )}
          </div>
          <ApiSettings
            apiUrl={apiUrl}
            setApiUrl={setApiUrl}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
          />
        </div>

        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-500 bg-clip-text text-transparent">
            AI Image OCR Extractor
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            อัปโหลดรูปภาพได้พร้อมกันหลาย ๆ ไฟล์ และดึงข้อความด้วยความแม่นยำสูง
          </p>
        </div>

        {/* Work Area Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          
          {/* Left Side: Upload Queue & File Grid */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6">
            <UploadArea
              filesCount={files.length}
              dragActive={dragActive}
              isLoading={isLoading}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileSelect={handleFileChange}
              onSubmit={handleExtractText}
              fileInputRef={fileInputRef}
            />

            <PreviewGrid
              files={files}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              removeFile={removeFile}
              onAddMoreClick={() => fileInputRef.current?.click()}
            />
          </div>

          {/* Right Side: Tabbed Results */}
          <ResultPanel
            files={files}
            results={results}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoading={isLoading}
            isCopied={isCopied}
            onCopyClick={handleCopyToClipboard}
          />

        </div>

      </div>
    </div>
  );
}

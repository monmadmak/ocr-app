'use client';

import React from 'react';

interface ApiSettingsProps {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export const ApiSettings: React.FC<ApiSettingsProps> = ({
  apiUrl,
  setApiUrl,
  showSettings,
  setShowSettings,
}) => {
  return (
    <div className="space-y-4">
      {/* Settings Toggle Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 py-1.5 px-3 rounded-full transition-all duration-300"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          API Settings
        </button>
      </div>

      {/* Settings Input Drawer */}
      {showSettings && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Backend API Endpoint</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none transition-all duration-200"
            />
            <button 
              onClick={() => setShowSettings(false)}
              className="bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-teal-400 active:scale-95 transition-all duration-200"
            >
              บันทึก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

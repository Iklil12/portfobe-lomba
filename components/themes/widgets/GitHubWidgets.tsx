"use client";

import React from 'react';

// --- MOCK DATA ---
const MOCK_LANGUAGES = [
  { name: 'TypeScript', percentage: 75, color: '#3178c6' },
  { name: 'JavaScript', percentage: 18, color: '#f1e05a' },
  { name: 'CSS', percentage: 7, color: '#563d7c' },
];

const MOCK_REPO = {
  name: 'portfo-be-core',
  stars: 124,
  forks: 32,
  language: 'TypeScript',
  languageColor: '#3178c6',
  description: 'Premium Portfolio SaaS Engine',
};

// --- COMPONENT 1: GithubLanguagesWidget ---
export function GithubLanguagesWidget({ isDark = true }: { isDark?: boolean }) {
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-white/40' : 'text-gray-500';
  const textMuted = isDark ? 'text-white/30' : 'text-gray-400';
  const bgTrack = isDark ? 'bg-white/5' : 'bg-gray-200';
  
  return (
    <div className="flex flex-col h-full justify-between w-full">
      <div className="space-y-4 w-full">
        {MOCK_LANGUAGES.map((lang) => (
          <div key={lang.name} className="group w-full cursor-default">
            <div className="flex justify-between items-end mb-1.5">
              <span className={`${textPrimary} text-sm font-bold transition-colors ${isDark ? 'group-hover:text-white/90' : 'group-hover:text-black'}`}>
                {lang.name}
              </span>
              <span className={`${textSecondary} text-[10px] font-mono transition-colors ${isDark ? 'group-hover:text-white/70' : 'group-hover:text-gray-700'}`}>
                {lang.percentage}%
              </span>
            </div>
            
            {/* Progress Bar Container */}
            <div className={`w-full h-[6px] ${bgTrack} rounded-full overflow-hidden`}>
              {/* Progress Bar Fill with Glow */}
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out group-hover:brightness-110"
                style={{ 
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                  boxShadow: `0 0 10px ${lang.color}${isDark ? '60' : '40'}`
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="flex items-center gap-2 mt-6">
        <i className={`fab fa-github ${textMuted} text-[10px]`}></i>
        <span className={`text-[9px] uppercase tracking-widest ${textMuted} font-medium`}>
          Verified via GitHub API
        </span>
      </div>
    </div>
  );
}

// --- COMPONENT 2: GithubRepoWidget ---
export function GithubRepoWidget({ isDark = true }: { isDark?: boolean }) {
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-white/40' : 'text-gray-500';
  const textMuted = isDark ? 'text-white/50' : 'text-gray-400';
  const borderIcon = isDark ? 'border-white/5' : 'border-gray-200';
  const borderIconHover = isDark ? 'group-hover:border-white/20' : 'group-hover:border-gray-300';
  const bgIconHover = isDark ? 'group-hover:bg-white/[0.02]' : 'group-hover:bg-gray-50';

  return (
    <div className="flex flex-col h-full justify-between group cursor-pointer w-full">
      {/* Top Header */}
      <div className="flex justify-between items-start mb-4">
        {/* Thin Icon Container */}
        <div className={`w-8 h-8 rounded-full border ${borderIcon} bg-transparent flex items-center justify-center transition-all duration-300 ${borderIconHover} ${bgIconHover}`}>
          <i className={`fa-solid fa-book-bookmark ${textSecondary} text-sm transition-colors duration-300 ${isDark ? 'group-hover:text-white/80' : 'group-hover:text-gray-800'}`}></i>
        </div>
        
        {/* Stars and Forks */}
        <div className={`flex items-center gap-3 ${textSecondary} text-[11px] font-mono transition-colors duration-300 ${isDark ? 'group-hover:text-white/60' : 'group-hover:text-gray-700'}`}>
          <div className="flex items-center gap-1.5">
            <i className="fa-regular fa-star"></i>
            <span>{MOCK_REPO.stars}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-code-fork"></i>
            <span>{MOCK_REPO.forks}</span>
          </div>
        </div>
      </div>

      {/* Middle Content */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className={`text-lg font-bold ${textPrimary} mb-2 transition-colors duration-300 group-hover:text-[#ff9e00]`}>
          {MOCK_REPO.name}
        </h3>
        <p className={`text-xs ${textSecondary} line-clamp-2 leading-relaxed transition-colors duration-300 ${isDark ? 'group-hover:text-white/60' : 'group-hover:text-gray-600'}`}>
          {MOCK_REPO.description}
        </p>
      </div>

      {/* Bottom Language */}
      <div className="flex items-center gap-2 mt-4">
        <span 
          className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-110" 
          style={{ 
            backgroundColor: MOCK_REPO.languageColor, 
            boxShadow: `0 0 8px ${MOCK_REPO.languageColor}${isDark ? '80' : '50'}` 
          }}
        ></span>
        <span className={`text-[11px] font-medium ${textMuted} transition-colors duration-300 ${isDark ? 'group-hover:text-white/70' : 'group-hover:text-gray-600'}`}>
          {MOCK_REPO.language}
        </span>
      </div>
    </div>
  );
}

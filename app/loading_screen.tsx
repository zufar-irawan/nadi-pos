import React, { useEffect, useState } from 'react';

const LoadingScreen = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden font-sans">
      
      {/* Dekorasi Bulatan Atas Kiri */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#00CCEB] rounded-full opacity-90"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00A8C1] rounded-full opacity-50"></div>

      {/* Konten Utama */}
      <div className="flex flex-col items-center z-10 scale-110">
        {/* Logo NADI (SVG Placeholder) */}
        <div className="relative w-24 h-24 mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outline Huruf N */}
            <path 
              d="M30 70 V30 L70 70 V30" 
              fill="none" 
              stroke="#1E293B" 
              strokeWidth="10" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Aksen Gelombang Cyan */}
            <path 
              d="M25 55 Q50 25 75 55" 
              fill="none" 
              stroke="#00CCEB" 
              strokeWidth="6" 
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Teks NADI */}
        <h1 className="text-5xl font-extrabold text-[#1E293B] tracking-wider mb-4">
          NADI
        </h1>

        {/* Slogan */}
        <div className="text-center px-10">
          <p className="text-xl font-bold text-[#1E293B] leading-tight">
            Dari pemuda untuk
          </p>
          <p className="text-xl font-bold text-[#1E293B] leading-tight">
            perintis
          </p>
        </div>
      </div>

      {/* Dekorasi Bulatan Bawah Kanan */}
      <div className="absolute -bottom-20 -right-16 w-80 h-80 bg-[#00CCEB] rounded-full opacity-90"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#00A8C1] rounded-full opacity-50"></div>

      {/* Indikator Loading (Opsional) */}
      <div className="absolute bottom-12 animate-pulse text-gray-400 text-sm">
        Loading...
      </div>
    </div>
  );
};

export default LoadingScreen;
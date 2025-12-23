import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2 group cursor-pointer">
   
      <div className="relative flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
        <svg 
          viewBox="0 0 24 24" 
          className="w-7 h-7 text-white fill-none stroke-current stroke-[2.5]"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
     
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        
      
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-200"></span>
        </span>
      </div>

      
      <div className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight text-white italic">
          PROJECT<span className="text-blue-500">PULSE</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
          Health Tracker
        </span>
      </div>
    </div>
  );
};

export default Logo;
export function BackgroundDoodles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Cupcake SVG */}
      <svg 
        className="absolute top-20 left-10 w-16 h-16 opacity-[0.08] text-primary transform rotate-12"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M7 12v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8" />
        <path d="M5 8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1H5V8z" />
        <circle cx="12" cy="5" r="2" />
      </svg>

      <svg 
        className="absolute top-96 right-20 w-14 h-14 opacity-[0.08] text-primary transform -rotate-12"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M7 12v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8" />
        <path d="M5 8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1H5V8z" />
        <circle cx="12" cy="5" r="2" />
      </svg>

      {/* Cake slice SVG */}
      <svg 
        className="absolute top-60 right-10 w-18 h-18 opacity-[0.08] text-primary transform -rotate-6"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
        <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
        <path d="M2 21h20" />
        <path d="M7 8v3" />
        <path d="M12 8v3" />
        <path d="M17 8v3" />
      </svg>

      <svg 
        className="absolute bottom-40 right-40 w-14 h-14 opacity-[0.08] text-primary transform rotate-12"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
        <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
        <path d="M2 21h20" />
      </svg>

      {/* Donut SVG */}
      <svg 
        className="absolute top-2/3 right-16 w-16 h-16 opacity-[0.08] text-pink-500 transform rotate-12"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>

      <svg 
        className="absolute bottom-60 left-1/3 w-14 h-14 opacity-[0.08] text-pink-500 transform -rotate-6"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>

      {/* Cookie SVG */}
      <svg 
        className="absolute top-80 left-2/3 w-12 h-12 opacity-[0.08] text-amber-600 transform rotate-45"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <circle cx="15" cy="9" r="1" fill="currentColor" />
        <circle cx="12" cy="15" r="1" fill="currentColor" />
        <circle cx="10" cy="13" r="0.5" fill="currentColor" />
        <circle cx="14" cy="13" r="0.5" fill="currentColor" />
      </svg>

      {/* Hearts */}
      <svg 
        className="absolute top-1/4 left-1/3 w-10 h-10 opacity-[0.06] text-pink-400 transform rotate-6"
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="none"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      <svg 
        className="absolute bottom-1/4 left-40 w-8 h-8 opacity-[0.06] text-pink-400 transform -rotate-12"
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="none"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {/* Stars */}
      <svg 
        className="absolute top-52 left-1/2 w-8 h-8 opacity-[0.06] text-yellow-400 transform rotate-12"
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="none"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>

      <svg 
        className="absolute bottom-52 right-1/3 w-6 h-6 opacity-[0.06] text-yellow-400 transform -rotate-6"
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="none"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>

      {/* Additional cake elements */}
      <svg 
        className="absolute bottom-96 left-16 w-14 h-14 opacity-[0.08] text-primary transform rotate-6"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M12 2v9" />
        <path d="M8 2v9" />
        <path d="M16 2v9" />
        <circle cx="12" cy="6" r="2" />
      </svg>

      <svg 
        className="absolute top-1/2 left-20 w-16 h-16 opacity-[0.08] text-primary transform rotate-6"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>

      {/* Bottom decorations */}
      <svg 
        className="absolute bottom-32 right-32 w-12 h-12 opacity-[0.08] text-amber-600 transform -rotate-12"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <circle cx="15" cy="9" r="1" fill="currentColor" />
        <circle cx="12" cy="15" r="1" fill="currentColor" />
      </svg>

      <svg 
        className="absolute bottom-80 left-32 w-12 h-12 opacity-[0.08] text-primary transform rotate-45"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M7 12v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8" />
        <path d="M5 8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1H5V8z" />
        <circle cx="12" cy="5" r="2" />
      </svg>
    </div>
  );
}
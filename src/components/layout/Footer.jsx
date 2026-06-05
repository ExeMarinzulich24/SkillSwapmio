import React from 'react';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full mt-auto glass border-t border-glass-border rounded-none rounded-t-xl px-6 py-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-accent/10 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="bg-accent p-1.5 rounded-lg text-white">
            <Zap size={18} className="fill-current text-purple-200" />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            SkillSwap
          </span>
        </div>

        {/* Copyright */}
        <div className="text-gray-400 text-xs md:text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} SkillSwap. Todos los derechos reservados. Intercambia conocimientos, crece tu comunidad.
        </div>

        {/* Social Icons (Minisculos, con colores y hover) */}
        <div className="flex items-center gap-4">
          {/* LinkedIn */}
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()} 
            className="p-2 bg-white/5 border border-glass-border rounded-lg text-gray-400 hover:text-[#0077B5] hover:bg-white/10 hover:border-[#0077B5]/30 transition-all flex items-center justify-center"
            title="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          {/* GitHub */}
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()} 
            className="p-2 bg-white/5 border border-glass-border rounded-lg text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center"
            title="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>

          {/* Portfolio (Maletin) */}
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()} 
            className="p-2 bg-white/5 border border-glass-border rounded-lg text-gray-400 hover:text-[#eab308] hover:bg-white/10 hover:border-[#eab308]/30 transition-all flex items-center justify-center"
            title="Portafolio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </a>

          {/* Instagram */}
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()} 
            className="p-2 bg-white/5 border border-glass-border rounded-lg text-gray-400 hover:text-[#E1306C] hover:bg-white/10 hover:border-[#E1306C]/30 transition-all flex items-center justify-center"
            title="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

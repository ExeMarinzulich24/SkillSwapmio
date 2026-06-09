import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe } from 'lucide-react';

// Custom inline SVG icons for brands not exported in this version of lucide-react
const GithubIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full bg-dark-card border-t border-glass-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Columna 1: Información del proyecto */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="bg-accent p-1.5 rounded-lg text-white">
                <Zap size={18} className="fill-current text-purple-200" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                SkillSwap
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Somos colegas trabajando sobre este proyecto que creemos cambiará el rumbo de las cosas.
            </p>
          </div>

          {/* Columna 2: Información de Judith Dávalos */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Judith Dávalos
            </h3>
            <p className="text-xs text-gray-500 -mt-2">Desarrolladora de software</p>
            <nav aria-label="Enlaces de Judith Dávalos" className="flex flex-col gap-2">
              <a
                href="https://github.com/juroda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub de Judith Dávalos (abre en una nueva pestaña)"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200 w-fit"
              >
                <GithubIcon className="shrink-0" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/judithdavalos/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Judith Dávalos (abre en una nueva pestaña)"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200 w-fit"
              >
                <LinkedinIcon className="shrink-0" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://judithdavalos.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Portfolio de Judith Dávalos (abre en una nueva pestaña)"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200 w-fit"
              >
                <Globe size={16} className="shrink-0" />
                <span>Portfolio</span>
              </a>
            </nav>
          </div>

          {/* Columna 3: Ezequiel Marinzulich */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Ezequiel Marinzulich
            </h3>
            <p className="text-xs text-gray-500 -mt-2">Desarrollador de software</p>
            <nav aria-label="Enlaces de Ezequiel Marinzulich" className="flex flex-col gap-2">
              <a
                href="https://github.com/ExeMarinzulich24"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub de Ezequiel Marinzulich (abre en una nueva pestaña)"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200 w-fit"
              >
                <GithubIcon className="shrink-0" />
                <span>GitHub</span>
              </a>

              {/* LinkedIn y Portfolio - Preparado para agregar posteriormente */}
              {/* 
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Ezequiel Marinzulich (abre en una nueva pestaña)"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200 w-fit"
              >
                <LinkedinIcon className="shrink-0" />
                <span>LinkedIn</span>
              </a>
              */}
              {/* 
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Portfolio de Ezequiel Marinzulich (abre en una nueva pestaña)"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200 w-fit"
              >
                <Globe size={16} className="shrink-0" />
                <span>Portfolio</span>
              </a>
              */}
            </nav>
          </div>
        </div>

        {/* Divider and Legal */}
        <div className="border-t border-glass-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 SkillSwap, Inc. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Intercambio libre de conocimiento.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
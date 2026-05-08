import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass border-b-0 border-t-0 rounded-none rounded-b-xl px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-accent p-2 rounded-xl text-white">
            <Zap size={24} className="fill-current text-purple-200" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            SkillSwap
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/catalog" className="text-gray-300 hover:text-white transition-colors">
            Explorar
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 font-medium">
                  Panel Admin
                </Link>
              )}
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                <User size={18} />
                Mi Panel
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border hover:bg-glass-border transition-colors text-sm text-gray-300 hover:text-white"
              >
                <LogOut size={16} />
                Salir
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register"
                className="px-5 py-2 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors shadow-lg shadow-purple-900/30"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-glass-border mt-4 flex flex-col gap-4">
          <Link to="/catalog" className="px-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Explorar</Link>
          {user ? (
             <>
               {user.role === 'admin' && (
                 <Link to="/admin" className="px-2 text-red-400 hover:text-red-300 flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                   Panel Admin
                 </Link>
               )}
               <Link to="/dashboard" className="px-2 text-gray-300 hover:text-white flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                 <User size={18} /> Mi Panel
               </Link>
               <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left px-2 text-gray-300 hover:text-white flex items-center gap-2">
                 <LogOut size={18} /> Salir
               </button>
             </>
          ) : (
             <>
               <Link to="/login" className="px-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
               <Link to="/register" className="px-2 text-accent" onClick={() => setMenuOpen(false)}>Registrarse</Link>
             </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

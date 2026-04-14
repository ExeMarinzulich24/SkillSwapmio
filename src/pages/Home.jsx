import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-purple-500/30">
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-sm font-medium text-purple-200">El poder del conocimiento compartido</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Aprende y Enseña <br />
          <span className="text-gradient">Sin Usar Dinero</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          SkillSwap te permite conectar con una comunidad dispuesta a intercambiar habilidades. 
          Ofrece lo que sabes hacer y aprende lo que siempre quisiste, de forma colaborativa y gratuita.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!user ? (
            <>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 group">
                Únete a la comunidad
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/catalog" className="w-full sm:w-auto px-8 py-4 rounded-full glass hover:bg-white/5 text-white font-semibold transition-all flex items-center justify-center gap-2">
                <Search size={18} />
                Explorar habilidades
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 group">
                Ir a mi Panel
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/catalog" className="w-full sm:w-auto px-8 py-4 rounded-full glass hover:bg-white/5 text-white font-semibold transition-all flex items-center justify-center gap-2">
                <Search size={18} />
                Buscar nuevos intercambios
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats/Features simple section below */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full z-10"
      >
        {[
          { title: "+500", desc: "Usuarios activos" },
          { title: "∞", desc: "Intercambios posibles" },
          { title: "100%", desc: "Gratis y colaborativo" }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 text-center">
            <h3 className="text-3xl font-bold text-white mb-2">{stat.title}</h3>
            <p className="text-gray-400">{stat.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;

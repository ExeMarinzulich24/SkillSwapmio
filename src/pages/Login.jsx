import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Complete todos los campos obligatorios.');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h2>
          <p className="text-gray-400 text-sm">Bienvenido de nuevo a SkillSwap</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-purple-900/40 mt-6 md:mt-8"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

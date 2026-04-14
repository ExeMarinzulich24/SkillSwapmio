import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    city: '',
    category: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.city || !formData.category) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Mock register
    const success = register(formData);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Error al registrar usuario.');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
          <p className="text-gray-400 text-sm">Únete a la comunidad de intercambio</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-gray-500" />
              <input 
                type="text" 
                name="name"
                placeholder="Nombre" 
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required 
              />
            </div>
            <div className="relative">
              <input 
                type="text" 
                name="surname"
                placeholder="Apellido" 
                value={formData.surname}
                onChange={handleChange}
                className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required 
              />
            </div>
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="email" 
              name="email"
              placeholder="Correo electrónico" 
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="password" 
              name="password"
              placeholder="Contraseña" 
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>

          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" 
              name="city"
              placeholder="Ciudad" 
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>

          <div className="relative">
            <Tag size={18} className="absolute left-3 top-[14px] text-gray-500" />
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-gray-300 focus:outline-none focus:border-purple-500 transition-colors appearance-none"
              required
            >
              <option value="" disabled className="bg-dark text-gray-500">Categoría de interés principal</option>
              <option value="tecnologia" className="bg-dark text-white">Tecnología e Informática</option>
              <option value="idiomas" className="bg-dark text-white">Idiomas</option>
              <option value="arte" className="bg-dark text-white">Arte y Diseño</option>
              <option value="musica" className="bg-dark text-white">Música</option>
              <option value="deportes" className="bg-dark text-white">Deportes y Bienestar</option>
              <option value="oficios" className="bg-dark text-white">Oficios</option>
              <option value="otros" className="bg-dark text-white">Otros</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-purple-900/40 mt-4"
          >
            Registrarme
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

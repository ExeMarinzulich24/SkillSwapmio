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
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.city || !formData.category) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Error al registrar usuario: ' + (err.message || 'Desconocido'));
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

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px bg-glass-border flex-1"></div>
          <span className="text-gray-400 text-sm">O regístrate con</span>
          <div className="h-px bg-glass-border flex-1"></div>
        </div>

        <button 
          onClick={async () => {
            try {
              await loginWithGoogle();
            } catch (err) {
              console.error(err);
              setError('Error al registrarse con Google.');
            }
          }}
          className="w-full mt-6 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-3"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          Google
        </button>

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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, UserX, UserCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si no es admin, lo pateamos a la home
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    // Traemos todos los perfiles excepto el del propio admin (para no auto-banearse)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleToggleBan = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const confirmMessage = newStatus 
      ? '¿Estás seguro de que quieres SUSPENDER a este usuario? Perderá acceso a la plataforma.'
      : '¿Quieres levantar la suspensión a este usuario?';

    if (window.confirm(confirmMessage)) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: newStatus })
        .eq('id', userId);

      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_banned: newStatus } : u));
      } else {
        alert('Error al cambiar el estado del usuario');
      }
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-500/20 rounded-2xl text-red-400">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
            <p className="text-gray-400">Gestiona usuarios y modera la plataforma</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <UserX size={20} className="text-red-400" />
            Control de Usuarios
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center py-8">Cargando usuarios...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="pb-4 text-gray-400 font-medium">Usuario</th>
                    <th className="pb-4 text-gray-400 font-medium">Ubicación</th>
                    <th className="pb-4 text-gray-400 font-medium">Estado</th>
                    <th className="pb-4 text-gray-400 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-glass-border/50 hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${u.is_banned ? 'bg-red-500/50' : 'bg-gradient-to-tr from-purple-500 to-pink-500'}`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.name}</p>
                            <p className="text-xs text-gray-500">ID: {u.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-300">{u.city || '-'}</td>
                      <td className="py-4">
                        {u.is_banned ? (
                          <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                            <ShieldAlert size={12} /> Suspendido
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                            <UserCheck size={12} /> Activo
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleToggleBan(u.id, u.is_banned)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            u.is_banned 
                            ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {u.is_banned ? 'Levantar Suspensión' : 'Suspender Cuenta'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">No hay otros usuarios en la plataforma.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;

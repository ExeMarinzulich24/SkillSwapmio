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
    // Si no es admin ni moderador, lo pateamos a la home
    if (user && user.role !== 'admin' && user.role !== 'moderator') {
      navigate('/');
      return;
    }

    if (user?.role === 'admin' || user?.role === 'moderator') {
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

  const isMasterAdmin = user?.role === 'admin';

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

  const handleRoleChange = async (userId, newRole) => {
    const confirmMessage = `¿Estás seguro de que quieres cambiar el rol de este usuario a ${newRole.toUpperCase()}?`;

    if (window.confirm(confirmMessage)) {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        alert('Error al cambiar el rol del usuario');
      }
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) return null;

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserX size={20} className="text-red-400" />
              Control de Usuarios
            </h2>
            {isMasterAdmin && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
                Modo Maestro Activado
              </span>
            )}
          </div>

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
                    {isMasterAdmin && <th className="pb-4 text-gray-400 font-medium text-center">Rol</th>}
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
                      
                      {isMasterAdmin && (
                        <td className="py-4 text-center">
                          <select 
                            value={u.role || 'user'}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-dark/80 border border-glass-border text-sm rounded-lg px-2 py-1 text-gray-300 focus:outline-none focus:border-purple-500"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      )}

                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={isMasterAdmin ? "5" : "4"} className="py-8 text-center text-gray-500">
                        No hay otros usuarios en la plataforma.
                      </td>
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

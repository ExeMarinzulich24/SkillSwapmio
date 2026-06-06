import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, LogOut, User, Menu, X, Clock, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../utils/supabase';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  const playNotificationChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Tone 1 (E6, ~1318.51 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1318.51, ctx.currentTime);
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.15);
      
      // Tone 2 (A6, ~1760.00 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1760.00, ctx.currentTime + 0.08);
      gain2.gain.setValueAtTime(0.001, ctx.currentTime);
      gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        setNotifications(data);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel(`public:notifications:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotif = payload.new;
          setNotifications(prev => [newNotif, ...prev].slice(0, 10));
          
          setActiveToast(newNotif);
          playNotificationChime();
          
          setTimeout(() => {
            setActiveToast(current => current?.id === newNotif.id ? null : current);
          }, 4000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    if (!error) {
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    }
  };

  const handleNotificationClick = async (notif) => {
    setShowNotifications(false);
    setActiveToast(null);
    
    if (!notif.is_read) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notif.id);
      
      setNotifications(notifications.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    }
    
    if (notif.link) {
      navigate(notif.link);
    }
  };

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
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold rounded-full select-none" title="Tus créditos de tiempo disponibles">
                <Clock size={12} className="text-purple-400" />
                <span>{user.time_credits ?? 5} Crédito(s)</span>
              </div>

              {/* Notificaciones Bell Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer relative border border-transparent"
                  title="Notificaciones"
                >
                  <Bell size={18} />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-dark animate-pulse" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-dark-card border border-glass-border rounded-xl shadow-2xl z-50 p-4 divide-y divide-glass-border/40"
                      >
                        <div className="flex justify-between items-center pb-2 mb-2">
                          <span className="text-white font-bold text-xs">Notificaciones</span>
                          {notifications.some(n => !n.is_read) && (
                            <button 
                              onClick={handleMarkAllAsRead} 
                              className="text-[10px] text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
                            >
                              Marcar leídas
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-1 pt-2 max-h-64 overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <p className="text-gray-500 text-xs italic text-center py-4">No tienes notificaciones.</p>
                          ) : (
                            notifications.map(notif => (
                              <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-2 rounded-lg text-left transition-colors cursor-pointer hover:bg-white/5 ${
                                  !notif.is_read ? 'bg-purple-500/5' : ''
                                }`}
                              >
                                <p className={`text-xs ${!notif.is_read ? 'text-white font-semibold' : 'text-gray-300'}`}>
                                  {notif.title}
                                </p>
                                <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">
                                  {notif.content}
                                </p>
                                <span className="text-[8px] text-gray-600 block text-right mt-1">
                                  {new Date(notif.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {(user.role === 'admin' || user.role === 'moderator') && (
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
               <div className="flex items-center justify-between px-2 border-b border-glass-border/20 pb-3">
                 <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold rounded-full select-none px-3 py-1.5" title="Tus créditos de tiempo disponibles">
                   <Clock size={12} className="text-purple-400" />
                   <span>{user.time_credits ?? 5} Créditos</span>
                 </div>
                 
                 <div className="relative">
                   <button
                     onClick={() => setShowNotifications(!showNotifications)}
                     className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer relative border border-transparent"
                   >
                     <Bell size={18} />
                     {notifications.filter(n => !n.is_read).length > 0 && (
                       <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-dark" />
                     )}
                   </button>
                 </div>
               </div>

               <AnimatePresence>
                 {showNotifications && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="bg-dark-card border border-glass-border rounded-xl p-3 space-y-2 mt-1"
                   >
                     <div className="flex justify-between items-center pb-2 border-b border-glass-border/30">
                       <span className="text-white font-bold text-[10px]">Notificaciones</span>
                       {notifications.some(n => !n.is_read) && (
                         <button 
                           onClick={handleMarkAllAsRead} 
                           className="text-[9px] text-purple-400 font-medium"
                         >
                           Marcar leídas
                         </button>
                       )}
                     </div>
                     <div className="space-y-1.5 max-h-48 overflow-y-auto">
                       {notifications.length === 0 ? (
                         <p className="text-gray-500 text-[10px] italic text-center py-2">Sin notificaciones.</p>
                       ) : (
                         notifications.map(notif => (
                           <div
                             key={notif.id}
                             onClick={() => {
                               handleNotificationClick(notif);
                               setMenuOpen(false);
                             }}
                             className={`p-2 rounded-lg text-left transition-colors cursor-pointer ${
                               !notif.is_read ? 'bg-purple-500/5' : ''
                             }`}
                           >
                             <p className="text-[11px] text-white font-semibold">{notif.title}</p>
                             <p className="text-[10px] text-gray-400 leading-snug">{notif.content}</p>
                           </div>
                         ))
                       )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {(user.role === 'admin' || user.role === 'moderator') && (
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

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onClick={() => handleNotificationClick(activeToast)}
            className="fixed bottom-6 right-6 z-[100] max-w-sm w-80 bg-dark-card border border-glass-border/80 p-4 rounded-2xl shadow-2xl cursor-pointer hover:border-purple-500/40 transition-colors group flex items-start gap-3 select-none"
          >
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1.5 shrink-0 animate-ping" />
            <div className="flex-grow">
              <h4 className="text-white font-bold text-xs group-hover:text-purple-400 transition-colors">
                {activeToast.title}
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {activeToast.content}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveToast(null);
              }}
              className="text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded-lg shrink-0 border border-transparent"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

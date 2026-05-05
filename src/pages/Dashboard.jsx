import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, X, MessageSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('skills'); // skills, requests_in, requests_out
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [mySkills, setMySkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  
  const [inRequests, setInRequests] = useState([]);
  const [outRequests, setOutRequests] = useState([]);

  React.useEffect(() => {
    if (user) {
      if (activeTab === 'skills') fetchMySkills();
      if (activeTab === 'requests_in') fetchInRequests();
      if (activeTab === 'requests_out') fetchOutRequests();
    }
  }, [user, activeTab]);

  const fetchInRequests = async () => {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        id, status, message, created_at,
        sender:sender_id(name),
        target_skill:target_skill_id(title)
      `)
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setInRequests(data);
  };

  const fetchOutRequests = async () => {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        id, status, message, created_at,
        receiver:receiver_id(name),
        target_skill:target_skill_id(title)
      `)
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setOutRequests(data);
  };

  const fetchMySkills = async () => {
    setLoadingSkills(true);
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setMySkills(data);
    }
    setLoadingSkills(false);
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSkill = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      modality: formData.get('modality'),
      level: formData.get('level'),
      availability: formData.get('availability'),
      owner_id: user.id
    };

    const { error } = await supabase.from('skills').insert([newSkill]);
    
    if (!error) {
      setShowPublishModal(false);
      fetchMySkills(); // Refresh list
    } else {
      console.error(error);
      alert('Error al publicar la habilidad');
    }
  };

  const handleRequestAction = async (reqId, action) => {
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    
    // Update locally first for immediate feedback
    setInRequests(inRequests.map(req => 
      req.id === reqId ? { ...req, status: newStatus } : req
    ));

    // Update in database
    await supabase
      .from('requests')
      .update({ status: newStatus })
      .eq('id', reqId);

    if (action === 'accept') {
      // Navigate to messages
      navigate(`/messages/${reqId}`);
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Profile Summary */}
          <div className="w-full md:w-80 flex flex-col gap-6">
            <div className="glass-card p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Usuario'} {user?.surname}</h2>
              <p className="text-purple-400 text-sm font-medium">{user?.email}</p>
              <p className="text-gray-400 text-sm mb-4">{user?.city}</p>
              
              <button 
                onClick={() => setShowPublishModal(true)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-glass-border"
              >
                <Plus size={18} />
                Publicar Habilidad
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('skills')}
                className={`py-3 px-4 rounded-xl text-left transition-colors ${activeTab === 'skills' ? 'bg-accent/20 text-white border border-accent/30' : 'text-gray-400 hover:bg-white/5'}`}
              >
                Mis Habilidades
              </button>
              <button 
                onClick={() => setActiveTab('requests_in')}
                className={`py-3 px-4 rounded-xl text-left flex justify-between items-center transition-colors ${activeTab === 'requests_in' ? 'bg-accent/20 text-white border border-accent/30' : 'text-gray-400 hover:bg-white/5'}`}
              >
                Solicitudes Recibidas
                {inRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {inRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('requests_out')}
                className={`py-3 px-4 rounded-xl text-left transition-colors ${activeTab === 'requests_out' ? 'bg-accent/20 text-white border border-accent/30' : 'text-gray-400 hover:bg-white/5'}`}
              >
                Mis Solicitudes
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'skills' && (
                <motion.div key="skills" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-2xl font-bold text-white mb-6">Mis Habilidades Publicadas</h3>
                  {loadingSkills ? (
                    <div className="glass-card p-8 border border-glass-border border-dashed flex flex-col items-center justify-center text-center">
                      <p className="text-gray-400">Cargando...</p>
                    </div>
                  ) : mySkills.length === 0 ? (
                    <div className="glass-card p-8 border border-glass-border border-dashed flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-4">
                        <Settings size={28} />
                      </div>
                      <h4 className="text-white font-medium mb-2">Aún no publicaste ninguna habilidad</h4>
                      <p className="text-gray-400 text-sm mb-6 max-w-sm">
                        Comienza a ofrecer tus conocimientos para recibir solicitudes de intercambio.
                      </p>
                      <button 
                        onClick={() => setShowPublishModal(true)}
                        className="px-6 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-colors"
                      >
                        Crear mi primera publicación
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mySkills.map(skill => (
                        <div key={skill.id} className="glass-card p-5">
                          <h4 className="text-lg font-bold text-white mb-2">{skill.title}</h4>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{skill.description}</p>
                          <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-md border border-purple-500/20">{skill.category}</span>
                            <span className="px-2 py-1 bg-white/5 text-gray-300 rounded-md border border-glass-border">{skill.modality}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'requests_in' && (
                <motion.div key="requests_in" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-2xl font-bold text-white mb-6">Solicitudes Recibidas</h3>
                  <div className="space-y-4">
                    {inRequests.map(req => (
                      <div key={req.id} className="glass border border-glass-border rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1 text-center md:text-left">
                          <p className="text-gray-300 text-sm mb-1">
                            <span className="font-semibold text-white">{req.sender?.name || 'Alguien'}</span> quiere aprender <span className="font-semibold text-purple-400">{req.target_skill?.title}</span>
                          </p>
                          <p className="text-gray-400 text-sm">
                            Mensaje: <span className="text-white">"{req.message}"</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {req.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => handleRequestAction(req.id, 'reject')}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Rechazar"
                              >
                                <X size={20} />
                              </button>
                              <button 
                                onClick={() => handleRequestAction(req.id, 'accept')}
                                className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-medium flex items-center gap-2"
                              >
                                <Check size={18} /> Aceptar
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                                req.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                {req.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                              </span>
                              {req.status === 'accepted' && (
                                <button 
                                  onClick={() => navigate(`/messages/${req.id}`)}
                                  className="p-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                                  title="Abrir Chat"
                                >
                                  <MessageSquare size={20} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'requests_out' && (
                <motion.div key="requests_out" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-2xl font-bold text-white mb-6">Mis Solicitudes Enviadas</h3>
                  {outRequests.length === 0 ? (
                    <div className="glass border border-glass-border rounded-xl p-8 text-center">
                      <p className="text-gray-400">No has enviado ninguna solicitud de intercambio recientemente.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {outRequests.map(req => (
                        <div key={req.id} className="glass border border-glass-border rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                          <div className="flex-1 text-center md:text-left">
                            <p className="text-gray-300 text-sm mb-1">
                              Le pediste a <span className="font-semibold text-white">{req.receiver?.name}</span> aprender <span className="font-semibold text-purple-400">{req.target_skill?.title}</span>
                            </p>
                            <p className="text-gray-400 text-sm italic">
                              "{req.message}"
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                              req.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                              req.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>
                              {req.status === 'accepted' ? 'Aceptada' : req.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                            </span>
                            {req.status === 'accepted' && (
                              <button 
                                onClick={() => navigate(`/messages/${req.id}`)}
                                className="p-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                                title="Abrir Chat"
                              >
                                <MessageSquare size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
              onClick={() => setShowPublishModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl p-8 relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-glass-border pb-4">
                <h3 className="text-2xl font-bold text-white">Publicar Nueva Habilidad</h3>
                <button onClick={() => setShowPublishModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handlePublishSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Título de la habilidad</label>
                  <input name="title" type="text" required className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500" placeholder="Ej. Clases de Guitarra" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                  <textarea name="description" required className="w-full h-24 bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 resize-none" placeholder="Describe qué ofreces..." />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                    <select name="category" required className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 appearance-none">
                      <option value="tecnologia">Tecnología</option>
                      <option value="idiomas">Idiomas</option>
                      <option value="arte">Arte y Diseño</option>
                      <option value="musica">Música</option>
                      <option value="deportes">Deportes</option>
                      <option value="oficios">Oficios</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Modalidad</label>
                    <select name="modality" required className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 appearance-none">
                      <option value="virtual">Virtual</option>
                      <option value="presencial">Presencial</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nivel</label>
                    <input name="level" type="text" required className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500" placeholder="Ej. Básico/Intermedio" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Disponibilidad</label>
                    <input name="availability" type="text" required className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500" placeholder="Ej. Fines de semana" />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-900/40">
                    Publicar Habilidad
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

const SkillDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, requesting, success, error

  // En una app real obtendríamos por ID si falta el estado
  const skill = state?.skill;

  if (!skill) {
    return (
      <div className="min-h-screen pt-28 px-6 flex flex-col items-center">
        <h2 className="text-2xl text-white mb-4">Habilidad no encontrada</h2>
        <button onClick={() => navigate('/catalog')} className="text-purple-400 hover:text-purple-300">Volver al catálogo</button>
      </div>
    );
  }

  const handleRequest = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const submitRequest = async () => {
    if (!requestMessage.trim()) return;
    setStatus('requesting');
    
    try {
      const { error } = await supabase.from('requests').insert([
        {
          sender_id: user.id,
          receiver_id: skill.owner_id,
          target_skill_id: skill.id,
          message: requestMessage
        }
      ]);

      if (error) throw error;
      
      setStatus('success');
      setTimeout(() => {
        setShowModal(false);
        navigate('/catalog');
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('Hubo un error al enviar la solicitud.');
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 relative">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="flex-1 w-full">
              <span className="inline-block px-4 py-1.5 bg-purple-500/10 text-purple-300 text-sm font-semibold rounded-full border border-purple-500/20 mb-4 capitalize">
                {skill.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {skill.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-glass-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-purple-500/30">
                  {skill.owner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium">{skill.owner.name}</h3>
                  <p className="text-sm text-gray-400">{skill.owner.city}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2 text-lg">Descripción</h4>
                  <p className="text-gray-300 leading-relaxed">{skill.description}</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 flex flex-col gap-6">
              <div className="bg-dark/50 border border-glass-border rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">Detalles del Intercambio</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Modalidad:</span>
                    <span className="text-white capitalize">{skill.modality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nivel:</span>
                    <span className="text-white">{skill.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Disponibilidad:</span>
                    <span className="text-white text-right break-words max-w-[140px]">{skill.availability}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleRequest}
                className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-purple-900/40"
              >
                <Send size={18} />
                Solicitar Intercambio
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal / Request Flow */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
              onClick={() => status !== 'requesting' && setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card w-full max-w-lg p-6 relative z-10"
            >
              {status === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={64} className="text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
                  <p className="text-gray-400">El usuario recibirá tu propuesta pronto.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-4">Proponer Intercambio</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Cuéntale a {skill.owner.name} qué habilidad quieres ofrecer a cambio de "{skill.title}".
                  </p>
                  
                  <textarea 
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Hola! Me interesa mucho tu habilidad. A cambio yo podría ofrecerte..."
                    className="w-full h-32 bg-dark border border-glass-border rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none mb-6"
                  />
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                      disabled={status === 'requesting'}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={submitRequest}
                      disabled={!requestMessage.trim() || status === 'requesting'}
                      className="flex-1 py-3 bg-accent disabled:bg-accent/50 disabled:cursor-not-allowed hover:bg-accent-hover text-white font-semibold rounded-xl transition-colors flex justify-center items-center gap-2"
                    >
                      {status === 'requesting' ? 'Enviando...' : 'Confirmar Envío'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillDetail;

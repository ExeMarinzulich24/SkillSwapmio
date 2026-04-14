import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { id } = useParams(); // request Id
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hola! Vi que aceptaste mi solicitud. ¿Cómo prefieres que nos organicemos?', sender: 'other', time: '10:30 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'me', time: 'Ahora' }]);
    setNewMessage('');
  };

  const handleConfirmCompletion = () => {
    setIsCompleted(true);
    // In a real app we'd dispatch to backend
  };

  if (!user) {
    return <div className="pt-28 px-6 text-center text-white">Debes iniciar sesión.</div>;
  }

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col h-[80vh] glass rounded-3xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-glass-border flex justify-between items-center bg-dark/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  Martín
                  {isCompleted && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/20">Finalizado</span>}
                </h3>
                <p className="text-xs text-gray-400">Intercambio: Clases de Francés</p>
              </div>
            </div>
          </div>
          
          {!isCompleted && (
            <button 
              onClick={handleConfirmCompletion}
              className="text-sm px-4 py-2 bg-accent/20 hover:bg-accent/40 text-purple-200 rounded-lg transition-colors border border-accent/30 flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span className="hidden sm:inline">Confirmar Intercambio Realizado</span>
            </button>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map(msg => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`max-w-[75%] rounded-2xl p-4 ${msg.sender === 'me' ? 'bg-accent text-white self-end rounded-tr-sm' : 'bg-dark-card border border-glass-border text-gray-200 self-start rounded-tl-sm'}`}
            >
              <p>{msg.text}</p>
              <span className={`text-[10px] mt-2 block ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-500'}`}>{msg.time}</span>
            </motion.div>
          ))}
          {isCompleted && (
            <div className="text-center my-4">
              <span className="bg-dark-card border border-glass-border rounded-full px-4 py-1 text-xs text-gray-400">
                El intercambio ha sido marcado como completado
              </span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-glass-border bg-dark/40 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isCompleted}
              placeholder={isCompleted ? "Intercambio finalizado..." : "Escribe un mensaje..."}
              className="w-full bg-dark/50 border border-glass-border rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim() || isCompleted}
              className="absolute right-2 p-2.5 bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white rounded-full transition-colors"
            >
              <Send size={18} className="translate-x-[1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;

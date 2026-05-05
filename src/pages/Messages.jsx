import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

const Messages = () => {
  const { id } = useParams(); // request Id
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [requestDetails, setRequestDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchChatData = async () => {
      // 1. Get request details
      const { data: reqData, error: reqError } = await supabase
        .from('requests')
        .select(`
          *,
          sender:sender_id(id, name),
          receiver:receiver_id(id, name),
          target_skill:target_skill_id(title)
        `)
        .eq('id', id)
        .single();
        
      if (reqError || !reqData) {
        console.error("Error fetching request:", reqError);
        navigate('/dashboard');
        return;
      }
      
      setRequestDetails(reqData);

      // 2. Get messages
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('request_id', id)
        .order('created_at', { ascending: true });
        
      if (!msgError && msgData) {
        setMessages(msgData);
      }
      
      setLoading(false);
      scrollToBottom();
    };

    fetchChatData();
  }, [id, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const text = newMessage;
    setNewMessage('');
    
    // Optimistic update
    const tempMsg = {
      id: Date.now().toString(),
      content: text,
      sender_id: user.id,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    const { error } = await supabase
      .from('messages')
      .insert([{
        request_id: id,
        sender_id: user.id,
        content: text
      }]);
      
    if (error) {
      console.error("Error sending message:", error);
      // Revert optimistic update if error
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
  };

  if (!user) {
    return <div className="pt-28 px-6 text-center text-white">Debes iniciar sesión.</div>;
  }

  if (loading) {
    return <div className="pt-28 px-6 text-center text-gray-400">Cargando chat...</div>;
  }

  // Determine the "other" user
  const isSender = requestDetails.sender.id === user.id;
  const otherUser = isSender ? requestDetails.receiver : requestDetails.sender;
  const isCompleted = requestDetails.status === 'completed';

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
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
                {otherUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  {otherUser.name}
                  {isCompleted && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/20">Finalizado</span>}
                </h3>
                <p className="text-xs text-purple-400">Habilidad: {requestDetails.target_skill.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {/* Mensaje inicial de la solicitud */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[75%] rounded-2xl p-4 ${requestDetails.sender.id === user.id ? 'bg-accent text-white self-end rounded-tr-sm' : 'bg-dark-card border border-glass-border text-gray-200 self-start rounded-tl-sm'}`}
          >
            <p className="italic">Mensaje de solicitud original:</p>
            <p className="mt-1">"{requestDetails.message}"</p>
          </motion.div>

          {messages.map(msg => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`max-w-[75%] rounded-2xl p-4 ${msg.sender_id === user.id ? 'bg-accent text-white self-end rounded-tr-sm' : 'bg-dark-card border border-glass-border text-gray-200 self-start rounded-tl-sm'}`}
            >
              <p>{msg.content}</p>
              <span className={`text-[10px] mt-2 block opacity-70`}>
                {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
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

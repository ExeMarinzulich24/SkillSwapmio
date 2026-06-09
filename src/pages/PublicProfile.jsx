import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Calendar, Clock, Star, Users } from 'lucide-react';

const categoryMap = {
  tecnologia: 'Tecnología',
  idiomas: 'Idiomas',
  arte: 'Arte y Diseño',
  musica: 'Música',
  deportes: 'Deportes',
  oficios: 'Oficios',
  otros: 'Otros',
};

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skills'); // skills, reviews

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Fetch Profile details
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch Skills offered by this user
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('owner_id', id)
          .order('created_at', { ascending: false });

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);

        // Fetch Reviews received by this user
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*, reviewer:profiles!reviewer_id(name, avatar_url)')
          .eq('reviewee_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);

      } catch (err) {
        console.error('Error fetching public profile details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 px-6 flex items-center justify-center text-white text-2xl">
        Cargando perfil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-28 px-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl text-white mb-4">Perfil no encontrado</h2>
        <button onClick={() => navigate('/catalog')} className="text-purple-400 hover:text-purple-300">
          Volver al catálogo
        </button>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 relative">
      {/* Background glow */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[60%] h-[30%] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 cursor-pointer border border-transparent"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        {/* Profile Card Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-10 mb-8 relative overflow-hidden rounded-2xl border border-glass-border"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-glass-border relative flex items-center justify-center shadow-xl flex-shrink-0 bg-dark/30">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-grow space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-white leading-tight">
                  {profile.name} {profile.surname || ''}
                </h1>
                <p className="text-gray-400 text-sm mt-1 flex items-center justify-center md:justify-start gap-1">
                  <MapPin size={14} className="text-accent" /> {profile.city || 'No especificada'}
                </p>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                {avgRating ? (
                  <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-full select-none">
                    <Star size={12} className="fill-current" />
                    <span>{avgRating} ({reviews.length} valoraciones)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full select-none">
                    <Star size={12} />
                    <span>Sin valoraciones aún</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full select-none">
                  <Clock size={12} className="text-purple-400" />
                  <span>{profile.time_credits ?? 5} Créditos de Tiempo</span>
                </div>

                <div className="flex items-center gap-1 bg-white/5 border border-glass-border/30 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full select-none">
                  <Calendar size={12} className="text-gray-400" />
                  <span>Miembro desde {new Date(profile.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Selection */}
        <div className="flex border-b border-glass-border mb-6">
          <button 
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-6 font-semibold text-sm transition-colors border-b-2 cursor-pointer ${
              activeTab === 'skills' 
                ? 'border-purple-500 text-purple-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Habilidades que Ofrece ({skills.length})
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-6 font-semibold text-sm transition-colors border-b-2 cursor-pointer ${
              activeTab === 'reviews' 
                ? 'border-purple-500 text-purple-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Valoraciones de la Comunidad ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'skills' && (
            <motion.div 
              key="skills" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {skills.length === 0 ? (
                <div className="text-center py-12 bg-dark-card/50 rounded-2xl border border-glass-border">
                  <p className="text-gray-400 text-sm">Este usuario no ha publicado ninguna habilidad aún.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill) => (
                    <div 
                      key={skill.id}
                      onClick={() => navigate(`/skill/${skill.id}`, { state: { skill } })}
                      className="glass-card flex flex-col p-6 cursor-pointer group hover:border-purple-500/30 transition-all"
                    >
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/20 mb-3">
                          {categoryMap[skill.category] || skill.category}
                        </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                          {skill.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                        {skill.description}
                      </p>
                      
                      <div className="pt-4 border-t border-glass-border flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-1.5 capitalize">
                          <Users size={12} />
                          <span>Nivel: {skill.level}</span>
                        </div>
                        <span className="capitalize">{skill.modality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-dark-card/50 rounded-2xl border border-glass-border">
                  <p className="text-gray-400 text-sm">Este mentor no cuenta con valoraciones recibidas todavía.</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white/5 border border-glass-border/40 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-glass-border bg-dark/30 flex items-center justify-center text-xs font-bold text-white">
                          {rev.reviewer?.avatar_url ? (
                            <img src={rev.reviewer.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            rev.reviewer?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <span className="text-white font-medium text-sm">{rev.reviewer?.name || 'Usuario'}</span>
                      </div>
                      <div className="flex text-yellow-400 text-xs">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-gray-300 text-sm leading-relaxed italic">"{rev.comment}"</p>
                    )}
                    <p className="text-xs text-gray-500 text-right">
                      {new Date(rev.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PublicProfile;

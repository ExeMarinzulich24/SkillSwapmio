import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Search, Filter, MapPin, Monitor, Users, Trash2, SlidersHorizontal, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const categoryMap = {
  tecnologia: 'Tecnología',
  idiomas: 'Idiomas',
  arte: 'Arte y Diseño',
  musica: 'Música',
  deportes: 'Deportes',
  oficios: 'Oficios',
  otros: 'Otros',
};

const Catalog = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterModality, setFilterModality] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const hasActiveFilters = !!(search || filterCategory || filterLevel || filterModality || filterLocation);
  const handleClearFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterLevel('');
    setFilterModality('');
    setFilterLocation('');
  };

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('skills')
          .select(`
            *,
            owner:profiles(id, name, city, reviews:reviews!reviewee_id(rating))
          `);
        
        if (error) throw error;
        if (data) {
          setSkills(data);
        }
      } catch (err) {
        console.error("Error al cargar habilidades del catálogo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => setFilterCategory(e.target.value);

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('¿Estás seguro de que deseas borrar esta publicación? Como moderador esta acción es permanente.')) {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);
      
      if (!error) {
        setSkills(skills.filter(s => s.id !== skillId));
        alert('Publicación borrada con éxito.');
      } else {
        console.error(error);
        alert('Error al borrar la publicación.');
      }
    }
  };

  const filteredSkills = skills.filter((skill) => {
    const matchSearch = skill.title.toLowerCase().includes(search.toLowerCase()) || 
                        skill.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory ? skill.category === filterCategory : true;
    const matchLevel = filterLevel ? skill.level === filterLevel : true;
    const matchModality = filterModality ? skill.modality === filterModality : true;
    const matchLocation = filterLocation ? (
      (skill.owner?.city?.toLowerCase() || '').includes(filterLocation.toLowerCase())
    ) : true;
    return matchSearch && matchCat && matchLevel && matchModality && matchLocation;
  });

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 relative">
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[60%] h-[30%] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Catálogo de Habilidades</h1>
            <p className="text-gray-400">Descubre lo que la comunidad tiene para compartir.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-[14px] text-gray-500" />
              <input 
                type="text"
                placeholder="Buscar por palabra clave..."
                value={search}
                onChange={handleSearch}
                className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter size={18} className="absolute left-3 top-[14px] text-gray-500" />
              <select
                value={filterCategory}
                onChange={handleFilter}
                className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Todas las categorías</option>
                {Object.entries(categoryMap).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium cursor-pointer ${
                showAdvanced 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30' 
                  : 'bg-dark/50 border-glass-border text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              title="Filtros Avanzados"
            >
              <SlidersHorizontal size={16} />
              <span>Filtros</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer border border-pink-500/20 hover:border-pink-500/30 bg-pink-500/5 rounded-xl"
              >
                <X size={14} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="glass p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-glass-border/60 bg-dark/30 rounded-2xl mb-2">
                {/* Level Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Nivel</label>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="">Todos los niveles</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>

                {/* Modality Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Modalidad</label>
                  <select
                    value={filterModality}
                    onChange={(e) => setFilterModality(e.target.value)}
                    className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="">Todas las modalidades</option>
                    <option value="virtual">Virtual</option>
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Ubicación (Ciudad)</label>
                  <input
                    type="text"
                    placeholder="Ej. Buenos Aires..."
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-20 bg-dark-card/50 rounded-2xl border border-glass-border">
            <p className="text-gray-400 text-lg animate-pulse">Cargando habilidades...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20 bg-dark-card/50 rounded-2xl border border-glass-border">
            <p className="text-gray-400 text-lg">No hay habilidades que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, i) => {
              const ownerReviews = skill.owner?.reviews || [];
              const avgRating = ownerReviews.length > 0
                ? (ownerReviews.reduce((sum, r) => sum + r.rating, 0) / ownerReviews.length).toFixed(1)
                : null;

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="glass-card flex flex-col p-6 cursor-pointer group relative"
                  onClick={() => navigate(`/skill/${skill.id}`, { state: { skill } })}
                >
                {user && (user.role === 'admin' || user.role === 'moderator') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSkill(skill.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-600/10 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40 z-10"
                    title="Eliminar publicación"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className={`mb-4 ${user && (user.role === 'admin' || user.role === 'moderator') ? 'pr-8' : ''}`}>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/20">
                      {categoryMap[skill.category] || skill.category}
                    </span>
                    {skill.level && (
                      <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-300 text-xs font-semibold rounded-full border border-pink-500/20">
                        {skill.level}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    {skill.title}
                  </h3>
                </div>
                
                <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                  {skill.description}
                </p>
                
                 <div className="pt-4 border-t border-glass-border flex flex-col gap-2">
                   <div className="flex items-center justify-between text-xs text-gray-400">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${skill.owner_id}`);
                      }}
                      className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-pointer group/owner"
                      title={`Ver perfil de ${skill.owner.name}`}
                    >
                      <Users size={14} className="text-accent group-hover/owner:text-purple-400"/>
                      <span className="font-medium">{skill.owner.name}</span>
                    </div>
                    {avgRating ? (
                      <div className="flex items-center gap-1 text-yellow-400 font-semibold select-none">
                        <span>★</span>
                        <span>{avgRating} <span className="text-gray-500 text-[10px] font-normal">({ownerReviews.length})</span></span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 select-none">Nuevo</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <MapPin size={14} className="text-accent"/>
                    <span>{skill.owner.city}</span>
                    <span className="mx-1">•</span>
                    <Monitor size={14} className={skill.modality === 'virtual' ? 'text-green-400' : 'text-blue-400'}/>
                    <span className="capitalize">{skill.modality}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;

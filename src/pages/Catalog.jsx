import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { initialSkills } from '../utils/mockData';
import { Search, Filter, MapPin, Monitor, Users } from 'lucide-react';

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
  const [skills, setSkills] = useState(initialSkills);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => setFilterCategory(e.target.value);

  const filteredSkills = skills.filter((skill) => {
    const matchSearch = skill.title.toLowerCase().includes(search.toLowerCase()) || 
                        skill.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory ? skill.category === filterCategory : true;
    return matchSearch && matchCat;
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
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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
          </div>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="text-center py-20 bg-dark-card/50 rounded-2xl border border-glass-border">
            <p className="text-gray-400 text-lg">No hay habilidades que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card flex flex-col p-6 cursor-pointer group"
                onClick={() => navigate(`/skill/${skill.id}`, { state: { skill } })}
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
                
                <div className="pt-4 border-t border-glass-border flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users size={14} className="text-accent"/>
                    <span>{skill.owner.name}</span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, X, MessageSquare, Settings, Calendar, Clock, Trash2, ChevronLeft, ChevronRight, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('skills'); // skills, requests_in, requests_out
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [mySkills, setMySkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  
  const [inRequests, setInRequests] = useState([]);
  const [outRequests, setOutRequests] = useState([]);

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [availabilityList, setAvailabilityList] = useState([]);
  const [availabilityString, setAvailabilityString] = useState('');
  const [tempAvailabilityList, setTempAvailabilityList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [tempStartTime, setTempStartTime] = useState('09:00');
  const [tempEndTime, setTempEndTime] = useState('17:00');

  const [classesList, setClassesList] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedExchangeDate, setSelectedExchangeDate] = useState(null);
  const [currentExchangeMonthDate, setCurrentExchangeMonthDate] = useState(new Date());
  const [reschedulingClass, setReschedulingClass] = useState(null);
  const [newClassDate, setNewClassDate] = useState('');
  const [newClassTime, setNewClassTime] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratingClass, setRatingClass] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Profile settings states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsName, setSettingsName] = useState('');
  const [settingsSurname, setSettingsSurname] = useState('');
  const [settingsCity, setSettingsCity] = useState('');
  const [settingsAvatarUrl, setSettingsAvatarUrl] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Location Autocomplete states
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);

  const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayOfWeek = date.getDay();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    const numDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getFriendlyDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    let formatted = date.toLocaleDateString('es-ES', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatAvailability = (slots) => {
    if (slots.length === 0) return '';
    const groups = {};
    slots.forEach(slot => {
      const [y, m, d] = slot.dateStr.split('-');
      const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      const options = { day: '2-digit', month: 'short' };
      const dateFormatted = dateObj.toLocaleDateString('es-ES', options);
      if (!groups[dateFormatted]) {
        groups[dateFormatted] = [];
      }
      groups[dateFormatted].push(`${slot.startTime}-${slot.endTime}`);
    });
    return Object.entries(groups)
      .map(([date, times]) => `${date} (${times.join(', ')})`)
      .join(', ');
  };

  const parseAvailabilityStringToSlots = (str) => {
    if (!str) return [];
    const slots = [];
    const parts = str.split(/\),\s*/);
    const currentYear = new Date().getFullYear();
    
    parts.forEach(part => {
      if (!part.trim()) return;
      let cleaned = part.trim();
      if (!cleaned.endsWith(')')) cleaned += ')';
      
      const match = cleaned.match(/^([0-9]+\s+[a-zA-Záéíóú]+)\s*\((.+?)\)$/i);
      if (match) {
        const datePart = match[1].trim();
        const timesPart = match[2].trim();
        
        const [dayStr, monthStr] = datePart.split(/\s+/);
        const day = parseInt(dayStr);
        const cleanMonth = monthStr.toLowerCase().substring(0, 3);
        
        const spanishMonths = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const englishMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        
        let foundIndex = spanishMonths.indexOf(cleanMonth);
        if (foundIndex === -1) {
          foundIndex = englishMonths.indexOf(cleanMonth);
        }
        
        let monthIndex = new Date().getMonth();
        if (foundIndex !== -1) {
          monthIndex = foundIndex;
        }
        
        const dateObj = new Date(currentYear, monthIndex, day);
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        
        const timeRanges = timesPart.split(/,\s*/);
        timeRanges.forEach(range => {
          if (range.trim()) {
            slots.push({
              date: dateStr,
              time: range.trim()
            });
          }
        });
      }
    });
    return slots;
  };

  const handleOpenCalendar = () => {
    setTempAvailabilityList([...availabilityList]);
    setSelectedCalendarDate(null);
    setCurrentDate(new Date());
    setShowCalendarModal(true);
  };

  const handleConfirmAvailability = () => {
    setAvailabilityList(tempAvailabilityList);
    const formatted = formatAvailability(tempAvailabilityList);
    setAvailabilityString(formatted);
    setShowCalendarModal(false);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDay = new Date(day);
    checkDay.setHours(0, 0, 0, 0);
    if (checkDay < today) return;
    setSelectedCalendarDate(day);
  };

  const addTimeSlot = () => {
    if (!selectedCalendarDate) return;
    const dateStr = formatDateKey(selectedCalendarDate);
    if (!tempStartTime || !tempEndTime) return;
    
    if (tempStartTime >= tempEndTime) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    const newSlot = {
      id: Date.now() + Math.random(),
      dateStr,
      startTime: tempStartTime,
      endTime: tempEndTime
    };
    setTempAvailabilityList([...tempAvailabilityList, newSlot]);
  };

  const removeTimeSlot = (id) => {
    setTempAvailabilityList(tempAvailabilityList.filter(slot => slot.id !== id));
  };

  const hasSlots = (date) => {
    if (!date) return false;
    const dateStr = formatDateKey(date);
    return tempAvailabilityList.some(slot => slot.dateStr === dateStr);
  };

  const fetchMyClasses = async () => {
    if (!user) return;
    setLoadingClasses(true);
    const { data, error } = await supabase
      .from('classes')
      .select(`
        id, request_id, teacher_id, student_id, date, time, status,
        teacher:teacher_id(name),
        student:student_id(name),
        request:request_id(
          target_skill:target_skill_id(title, modality)
        ),
        reviews(id, rating, comment)
      `)
      .or(`teacher_id.eq.${user.id},student_id.eq.${user.id}`)
      .order('date', { ascending: true });

    if (data) {
      setClassesList(data);
    } else {
      console.error(error);
    }
    setLoadingClasses(false);
  };

  const handleCancelClass = async (classObj) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta clase?')) return;
    
    const { error } = await supabase
      .from('classes')
      .update({ status: 'cancelled' })
      .eq('id', classObj.id);

    if (!error) {
      const messageContent = `El usuario ${user.name || 'Usuario'} ha cancelado la clase del día ${getFriendlyDate(classObj.date)}`;
      
      await supabase.from('messages').insert({
        request_id: classObj.request_id,
        sender_id: user.id,
        content: messageContent
      });

      alert('Clase cancelada con éxito y notificación enviada al chat.');
      setSelectedExchangeDate(null); // Clear selection
      fetchMyClasses(); // Reload classes
    } else {
      console.error(error);
      alert('Hubo un error al cancelar la clase.');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!reschedulingClass || !newClassDate || !newClassTime) return;

    const todayStr = formatDateKey(new Date());
    if (newClassDate < todayStr) {
      alert('No puedes reprogramar una clase para una fecha anterior a hoy.');
      return;
    }

    const oldDate = reschedulingClass.date;
    
    const { error } = await supabase
      .from('classes')
      .update({
        date: newClassDate,
        time: newClassTime,
        status: 'rescheduled'
      })
      .eq('id', reschedulingClass.id);

    if (!error) {
      const messageContent = `El usuario ${user.name || 'Usuario'} ha reprogramado la clase del dia ${getFriendlyDate(oldDate)} para el dia ${getFriendlyDate(newClassDate)} en el horario ${newClassTime}.`;
      
      await supabase.from('messages').insert({
        request_id: reschedulingClass.request_id,
        sender_id: user.id,
        content: messageContent
      });

      alert('Clase reprogramada con éxito y notificación enviada al chat.');
      setReschedulingClass(null);
      setNewClassDate('');
      setNewClassTime('');
      setSelectedExchangeDate(null); // Clear selection
      fetchMyClasses(); // Reload classes
    } else {
      console.error(error);
      alert('Hubo un error al reprogramar la clase.');
    }
  };

  const handleCompleteClass = async (classObj) => {
    if (!window.confirm('¿Estás seguro de que deseas marcar esta clase como finalizada? Esto transferirá 1 crédito de tiempo del alumno al profesor.')) return;
    
    try {
      const { error } = await supabase.rpc('complete_class', { p_class_id: classObj.id });
      
      if (error) throw error;
      
      alert('Clase finalizada con éxito. Se ha transferido 1 crédito.');
      
      if (classObj.student_id === user.id) {
        setRatingClass(classObj);
        setReviewRating(5);
        setReviewComment('');
        setShowReviewModal(true);
      }
      
      await refreshUser();
      setSelectedExchangeDate(null);
      fetchMyClasses();
    } catch (err) {
      console.error(err);
      alert('Hubo un error al completar la clase: ' + (err.message || err.details || ''));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!ratingClass || !reviewRating) return;
    setSubmittingReview(true);
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          class_id: ratingClass.id,
          reviewer_id: user.id,
          reviewee_id: ratingClass.teacher_id,
          rating: reviewRating,
          comment: reviewComment
        }]);
        
      if (error) throw error;
      
      alert('¡Gracias por calificar la clase!');
      setShowReviewModal(false);
      setRatingClass(null);
      setReviewComment('');
      fetchMyClasses();
    } catch (err) {
      console.error(err);
      alert('Hubo un error al guardar la calificación: ' + (err.message || ''));
    }
    setSubmittingReview(false);
  };

  const handleDownloadICS = (c) => {
    const title = c.request?.target_skill?.title || 'Clase de SkillSwap';
    const partnerName = c.teacher_id === user.id ? c.student?.name : c.teacher?.name;
    const details = `Clase de SkillSwap con ${partnerName || 'Usuario'}.`;
    
    const datePart = c.date; // YYYY-MM-DD
    let startTime = '09:00';
    let endTime = '10:00';
    
    if (c.time) {
      const parts = c.time.split(/\s*-\s*/);
      if (parts[0]) startTime = parts[0].trim();
      if (parts[1]) endTime = parts[1].trim();
      else {
        const [h, m] = startTime.split(':').map(Number);
        endTime = `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      }
    }
    
    const cleanDate = datePart.replace(/-/g, ''); // YYYYMMDD
    const cleanStart = startTime.replace(/:/g, '') + '00'; // HHMMSS
    const cleanEnd = endTime.replace(/:/g, '') + '00'; // HHMMSS
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SkillSwap//Class Calendar//ES',
      'BEGIN:VEVENT',
      `UID:${c.id}@skillswap.com`,
      `DTSTAMP:${cleanDate}T000000Z`,
      `DTSTART:${cleanDate}T${cleanStart}`,
      `DTEND:${cleanDate}T${cleanEnd}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clase_skillswap_${c.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getGoogleCalendarUrl = (c) => {
    const title = c.request?.target_skill?.title || 'Clase de SkillSwap';
    const partnerName = c.teacher_id === user.id ? c.student?.name : c.teacher?.name;
    const details = `Clase de SkillSwap con ${partnerName || 'Usuario'}.`;
    const location = c.request?.target_skill?.modality === 'virtual' || c.request?.target_skill?.modality === 'hibrido'
      ? `https://meet.jit.si/SkillSwap_Class_${c.id}`
      : 'Presencial';

    const datePart = c.date; // YYYY-MM-DD
    let startTime = '09:00';
    let endTime = '10:00';
    
    if (c.time) {
      const parts = c.time.split(/\s*-\s*/);
      if (parts[0]) startTime = parts[0].trim();
      if (parts[1]) endTime = parts[1].trim();
      else {
        const [h, m] = startTime.split(':').map(Number);
        endTime = `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      }
    }
    
    const padTime = (t) => {
      const [h, m] = t.split(':').map(Number);
      return `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    };

    const cleanDate = datePart.replace(/-/g, ''); // YYYYMMDD
    const cleanStart = padTime(startTime);
    const cleanEnd = padTime(endTime);
    
    const dates = `${cleanDate}T${cleanStart}/${cleanDate}T${cleanEnd}`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  const searchLocation = async (query) => {
    setLocationQuery(query);
    if (query.trim().length < 3) {
      setLocationSuggestions([]);
      return;
    }
    setSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=es`
      );
      const data = await response.json();
      const suggestions = data.map(item => {
        const addr = item.address;
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.suburb || addr.county || '';
        const country = addr.country || '';
        return {
          display: city && country ? `${city}, ${country}` : item.display_name,
          city: city,
          country: country
        };
      }).filter(item => item.city && item.country);
      
      const unique = [];
      const seen = new Set();
      suggestions.forEach(s => {
        if (!seen.has(s.display)) {
          seen.add(s.display);
          unique.push(s);
        }
      });
      
      setLocationSuggestions(unique);
    } catch (err) {
      console.error('Error fetching location suggestions:', err);
    }
    setSearchingLocation(false);
  };

  const handleOpenSettings = () => {
    setSettingsName(user?.name || '');
    setSettingsSurname(user?.surname || '');
    setSettingsCity(user?.city || '');
    setSettingsAvatarUrl(user?.avatar_url || '');
    setSettingsPassword('');
    setSettingsConfirmPassword('');
    setLocationQuery(user?.city || '');
    setLocationSuggestions([]);
    setShowSettingsModal(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (settingsPassword && settingsPassword !== settingsConfirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setSavingSettings(true);

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: settingsName,
          surname: settingsSurname,
          city: settingsCity,
          avatar_url: settingsAvatarUrl
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      if (settingsPassword) {
        const { error: passError } = await supabase.auth.updateUser({
          password: settingsPassword
        });
        if (passError) throw passError;
      }

      await refreshUser();

      alert('Perfil actualizado con éxito');
      setShowSettingsModal(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Hubo un error al guardar los ajustes.');
    }
    setSavingSettings(false);
  };

  React.useEffect(() => {
    if (user) {
      if (activeTab === 'skills') fetchMySkills();
      if (activeTab === 'requests_in') fetchInRequests();
      if (activeTab === 'requests_out') fetchOutRequests();
      if (activeTab === 'exchanges') fetchMyClasses();
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
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setMySkills(data);
      }
    } catch (err) {
      console.error("Error fetching my skills:", err);
    } finally {
      setLoadingSkills(false);
    }
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

    if (!newSkill.availability || !newSkill.availability.trim()) {
      alert('Por favor, agenda al menos una fecha y horario de disponibilidad.');
      return;
    }

    const { error } = await supabase.from('skills').insert([newSkill]);
    
    if (!error) {
      setShowPublishModal(false);
      setAvailabilityList([]);
      setAvailabilityString('');
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
      try {
        const { data: reqData, error: reqErr } = await supabase
          .from('requests')
          .select('sender_id, receiver_id, target_skill_id')
          .eq('id', reqId)
          .single();

        if (reqData && !reqErr) {
          const { data: skillData, error: skillErr } = await supabase
            .from('skills')
            .select('availability')
            .eq('id', reqData.target_skill_id)
            .single();

          if (skillData && !skillErr && skillData.availability) {
            const slots = parseAvailabilityStringToSlots(skillData.availability);
            if (slots.length > 0) {
              const classesToInsert = slots.map(slot => ({
                request_id: reqId,
                teacher_id: reqData.receiver_id,
                student_id: reqData.sender_id,
                date: slot.date,
                time: slot.time,
                status: 'scheduled'
              }));
              
              await supabase.from('classes').insert(classesToInsert);
            }
          }
        }
      } catch (err) {
        console.error('Error generating classes on request accept:', err);
      }

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
              <button 
                type="button"
                onClick={handleOpenSettings}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg z-20 cursor-pointer"
                title="Ajustes de Perfil"
              >
                <Settings size={18} />
              </button>

              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4 shadow-lg border border-glass-border relative flex items-center justify-center">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Usuario'} {user?.surname || ''}</h2>
              <p className="text-purple-400 text-sm font-medium">{user?.email}</p>
              <p className="text-gray-400 text-sm mb-3">{user?.city}</p>
              
              <div className="flex items-center justify-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mx-auto mb-4 select-none">
                <Clock size={12} className="text-purple-400" />
                <span>{user?.time_credits ?? 5} Créditos de Tiempo</span>
              </div>
              
              <button 
                onClick={() => setShowPublishModal(true)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-glass-border cursor-pointer"
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
              <button 
                onClick={() => setActiveTab('exchanges')}
                className={`py-3 px-4 rounded-xl text-left transition-colors ${activeTab === 'exchanges' ? 'bg-accent/20 text-white border border-accent/30' : 'text-gray-400 hover:bg-white/5'}`}
              >
                Mis Intercambios
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

              {activeTab === 'exchanges' && (
                <motion.div key="exchanges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-2xl font-bold text-white mb-6">Mis Intercambios Agendados</h3>
                  
                  {loadingClasses ? (
                    <div className="glass-card p-8 border border-glass-border border-dashed flex flex-col items-center justify-center text-center">
                      <p className="text-gray-400 font-medium">Cargando intercambios...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Monthly Calendar (7 columns in lg) */}
                      <div className="lg:col-span-7 bg-dark/30 border border-glass-border rounded-2xl p-5 h-fit">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-white font-bold text-lg">
                            {MONTHS[currentExchangeMonthDate.getMonth()]} {currentExchangeMonthDate.getFullYear()}
                          </h4>
                          <div className="flex gap-2">
                            <button 
                              type="button" 
                              onClick={() => setCurrentExchangeMonthDate(new Date(currentExchangeMonthDate.getFullYear(), currentExchangeMonthDate.getMonth() - 1, 1))}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-glass-border cursor-pointer"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setCurrentExchangeMonthDate(new Date(currentExchangeMonthDate.getFullYear(), currentExchangeMonthDate.getMonth() + 1, 1))}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-glass-border cursor-pointer"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Day names */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
                          <span>Dom</span>
                          <span>Lun</span>
                          <span>Mar</span>
                          <span>Mié</span>
                          <span>Jue</span>
                          <span>Vie</span>
                          <span>Sáb</span>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-2">
                          {getDaysInMonth(currentExchangeMonthDate.getFullYear(), currentExchangeMonthDate.getMonth()).map((day, idx) => {
                            if (!day) return <div key={`empty-exch-${idx}`} />;
                            
                            const dateStr = formatDateKey(day);
                            const dayClasses = classesList.filter(c => c.date === dateStr);
                            const activeClasses = dayClasses.filter(c => c.status !== 'cancelled');
                            
                            const isTeacherOnDay = activeClasses.some(c => c.teacher_id === user.id);
                            const isStudentOnDay = activeClasses.some(c => c.student_id === user.id);

                            const isSelected = selectedExchangeDate && 
                              day.getDate() === selectedExchangeDate.getDate() && 
                              day.getMonth() === selectedExchangeDate.getMonth() && 
                              day.getFullYear() === selectedExchangeDate.getFullYear();

                            const today = new Date();
                            const isToday = day.getDate() === today.getDate() && 
                              day.getMonth() === today.getMonth() && 
                              day.getFullYear() === today.getFullYear();

                            return (
                              <button
                                key={`exch-${day.toISOString()}`}
                                type="button"
                                onClick={() => setSelectedExchangeDate(day)}
                                className={`h-12 w-full flex flex-col items-center justify-between py-1.5 rounded-xl text-sm relative transition-all cursor-pointer border ${
                                  isSelected
                                    ? 'bg-purple-600 text-white font-semibold border-purple-400 shadow-lg shadow-purple-900/30'
                                    : isToday
                                      ? 'border-purple-500 text-white font-medium bg-white/5'
                                      : 'text-gray-200 hover:bg-white/5 border-glass-border/30 bg-dark/20'
                                }`}
                              >
                                <span className="text-xs">{day.getDate()}</span>
                                <div className="flex gap-1 justify-center w-full min-h-[6px]">
                                  {isTeacherOnDay && (
                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`} title="Clase por dar" />
                                  )}
                                  {isStudentOnDay && (
                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} title="Clase por recibir" />
                                  )}
                                  {dayClasses.some(c => c.status === 'cancelled') && activeClasses.length === 0 && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600" title="Clase cancelada" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Calendar Legend */}
                        <div className="flex flex-wrap gap-4 mt-4 text-xs justify-center border-t border-glass-border/40 pt-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                            <span className="text-gray-400">Clase por dar (Profesor)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span className="text-gray-400">Clase por recibir (Alumno)</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Selected Date details (5 columns in lg) */}
                      <div className="lg:col-span-5 flex flex-col gap-4">
                        {selectedExchangeDate ? (
                          <div className="bg-dark/30 border border-glass-border rounded-2xl p-5 space-y-4 flex-1 flex flex-col">
                            <div>
                              <h4 className="text-white font-bold text-lg">Clases del Día</h4>
                              <p className="text-purple-400 text-sm font-semibold">{getFriendlyDate(formatDateKey(selectedExchangeDate))}</p>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar">
                              {classesList.filter(c => c.date === formatDateKey(selectedExchangeDate)).length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No hay clases programadas para este día.</p>
                              ) : (
                                classesList
                                  .filter(c => c.date === formatDateKey(selectedExchangeDate))
                                  .map(c => {
                                    const isTeacher = c.teacher_id === user.id;
                                    const partnerName = isTeacher ? c.student?.name : c.teacher?.name;
                                    const roleLabel = isTeacher ? 'Clase por dar (Profesor)' : 'Clase por recibir (Alumno)';
                                    const skillTitle = c.request?.target_skill?.title || 'Habilidad';

                                    return (
                                      <div key={c.id} className="border border-glass-border bg-dark/40 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h5 className="text-white font-bold text-sm leading-snug">{skillTitle}</h5>
                                            <p className={`text-xs font-semibold ${isTeacher ? 'text-purple-300' : 'text-emerald-300'} mt-0.5`}>
                                              {roleLabel}
                                            </p>
                                          </div>
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                            c.status === 'cancelled'
                                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                              : c.status === 'completed'
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : c.status === 'rescheduled'
                                                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                          }`}>
                                            {c.status === 'cancelled' ? 'Cancelada' : c.status === 'completed' ? 'Completada' : c.status === 'rescheduled' ? 'Reprogramada' : 'Agendada'}
                                          </span>
                                        </div>

                                        <div className="text-xs text-gray-400 space-y-1">
                                          <p>
                                            <strong className="text-gray-300">Compañero:</strong> {partnerName || 'Usuario'}
                                          </p>
                                          <p className="flex items-center gap-1">
                                            <strong className="text-gray-300">Horario:</strong> <Clock size={12} className="text-purple-400" /> {c.time}
                                          </p>
                                        </div>

                                        {c.status !== 'cancelled' && c.status !== 'completed' && (c.request?.target_skill?.modality === 'virtual' || c.request?.target_skill?.modality === 'hibrido') && (
                                          <div className="pt-2">
                                            <a
                                              href={`https://meet.jit.si/SkillSwap_Class_${c.id}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/20 text-center"
                                            >
                                              <Monitor size={14} /> Entrar al Aula Virtual
                                            </a>
                                          </div>
                                        )}

                                        {c.status !== 'cancelled' && c.status !== 'completed' && (
                                          <div className="pt-2">
                                            <a
                                              href={getGoogleCalendarUrl(c)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5 cursor-pointer text-center shadow-lg shadow-blue-500/10"
                                            >
                                              <Calendar size={14} /> Añadir a Google Calendar
                                            </a>
                                          </div>
                                        )}

                                        {c.status !== 'cancelled' && c.status !== 'completed' && (
                                          <div className="flex flex-col gap-2 pt-2">
                                            <button
                                              type="button"
                                              onClick={() => handleCompleteClass(c)}
                                              className="w-full py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-xs font-bold rounded-lg transition-colors border border-green-500/20 cursor-pointer text-center"
                                            >
                                              Marcar como Completada
                                            </button>
                                            <div className="flex gap-2">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setReschedulingClass(c);
                                                  setNewClassDate(c.date);
                                                  setNewClassTime(c.time);
                                                }}
                                                className="flex-1 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 text-xs font-semibold rounded-lg transition-colors border border-yellow-500/20 cursor-pointer text-center"
                                              >
                                                Reprogramar
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleCancelClass(c)}
                                                className="flex-1 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-semibold rounded-lg transition-colors border border-red-500/20 cursor-pointer text-center"
                                              >
                                                Cancelar
                                              </button>
                                            </div>
                                          </div>
                                        )}

                                        {c.status === 'completed' && c.student_id === user.id && (!c.reviews || c.reviews.length === 0) && (
                                          <div className="pt-2">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setRatingClass(c);
                                                setReviewRating(5);
                                                setReviewComment('');
                                                setShowReviewModal(true);
                                              }}
                                              className="w-full py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-purple-900/40 cursor-pointer text-center"
                                            >
                                              Dejar Calificación
                                            </button>
                                          </div>
                                        )}

                                        {c.status === 'completed' && c.reviews && c.reviews.length > 0 && (
                                          <div className="pt-2 flex flex-col gap-1 text-[11px] text-gray-400 bg-white/5 border border-glass-border/30 rounded-lg p-2">
                                            <div className="flex items-center gap-1">
                                              <span className="font-semibold text-gray-300">Tu Calificación:</span>
                                              <span className="text-yellow-400 font-bold flex items-center">
                                                {"★".repeat(c.reviews[0].rating)}{"☆".repeat(5 - c.reviews[0].rating)} ({c.reviews[0].rating}/5)
                                              </span>
                                            </div>
                                            {c.reviews[0].comment && (
                                              <p className="italic text-gray-400 mt-0.5">"{c.reviews[0].comment}"</p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-dark/20 border border-glass-border border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center flex-1 min-h-[220px]">
                            <Calendar size={36} className="text-gray-500 mb-2" />
                            <h4 className="text-white font-medium mb-1">Detalle del Día</h4>
                            <p className="text-gray-400 text-xs max-w-[200px] mx-auto">Selecciona una fecha en el calendario para ver y gestionar tus clases.</p>
                          </div>
                        )}
                      </div>
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
                    <div className="relative">
                      <select name="category" required className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer">
                        <option value="tecnologia">Tecnología</option>
                        <option value="idiomas">Idiomas</option>
                        <option value="arte">Arte y Diseño</option>
                        <option value="musica">Música</option>
                        <option value="deportes">Deportes</option>
                        <option value="oficios">Oficios</option>
                        <option value="otros">Otros</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-purple-400">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Modalidad</label>
                    <div className="relative">
                      <select name="modality" required className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer">
                        <option value="virtual">Virtual</option>
                        <option value="presencial">Presencial</option>
                        <option value="hibrido">Híbrido</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-purple-400">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nivel</label>
                    <div className="relative">
                      <select 
                        name="level" 
                        required 
                        className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                      >
                        <option value="" disabled selected className="bg-dark text-gray-400">Selecciona el nivel</option>
                        <option value="Básico" className="bg-dark text-white">Básico</option>
                        <option value="Intermedio" className="bg-dark text-white">Intermedio</option>
                        <option value="Avanzado" className="bg-dark text-white">Avanzado</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-purple-400">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Disponibilidad <span className="text-red-400">*</span>
                    </label>
                    <button 
                      type="button"
                      onClick={handleOpenCalendar}
                      className="w-full bg-dark/50 border border-glass-border hover:border-purple-500 rounded-xl py-3 px-4 text-left text-white focus:outline-none transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span className={availabilityString ? "text-white text-sm truncate max-w-[85%]" : "text-gray-400 text-sm truncate max-w-[85%]"}>
                        {availabilityString || "Agendar disponibilidad..."}
                      </span>
                      <Calendar size={18} className="text-purple-400 shrink-0" />
                    </button>
                    <input type="hidden" name="availability" value={availabilityString} required />
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

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendarModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
              onClick={() => setShowCalendarModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-glass-border pb-4">
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="text-purple-400" /> Agendar Disponibilidad
                </h3>
                <button onClick={() => setShowCalendarModal(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Calendar */}
                <div className="bg-dark/30 border border-glass-border rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-bold text-lg">
                      {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h4>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-glass-border cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-glass-border cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
                    <span>Dom</span>
                    <span>Lun</span>
                    <span>Mar</span>
                    <span>Mié</span>
                    <span>Jue</span>
                    <span>Vie</span>
                    <span>Sáb</span>
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()).map((day, idx) => {
                      if (!day) return <div key={`empty-${idx}`} />;
                      
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const checkDay = new Date(day);
                      checkDay.setHours(0, 0, 0, 0);
                      const isPast = checkDay < today;
                      
                      const isSelected = selectedCalendarDate && 
                        day.getDate() === selectedCalendarDate.getDate() && 
                        day.getMonth() === selectedCalendarDate.getMonth() && 
                        day.getFullYear() === selectedCalendarDate.getFullYear();
                        
                      const isToday = day.getDate() === today.getDate() && 
                        day.getMonth() === today.getMonth() && 
                        day.getFullYear() === today.getFullYear();

                      const dayHasSlots = hasSlots(day);

                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          disabled={isPast}
                          onClick={() => handleDayClick(day)}
                          className={`h-10 w-full flex flex-col items-center justify-center rounded-xl text-sm relative transition-all cursor-pointer ${
                            isPast 
                              ? 'text-gray-600 cursor-not-allowed opacity-40' 
                              : isSelected
                                ? 'bg-purple-600 text-white font-semibold shadow-lg shadow-purple-900/30'
                                : isToday
                                  ? 'border border-purple-500 text-white font-medium'
                                  : 'text-gray-200 hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <span>{day.getDate()}</span>
                          {dayHasSlots && (
                            <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isSelected ? 'bg-white' : 'bg-purple-400 animate-pulse'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Date Editor & Selection summary */}
                <div className="flex flex-col gap-6">
                  {selectedCalendarDate ? (
                    <div className="bg-dark/30 border border-glass-border rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="text-white font-semibold text-base">Programar Horarios</h4>
                        <p className="text-purple-400 text-sm font-medium">{getFriendlyDate(formatDateKey(selectedCalendarDate))}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Hora Inicio</label>
                          <input 
                            type="time" 
                            value={tempStartTime} 
                            onChange={(e) => setTempStartTime(e.target.value)} 
                            className="w-full bg-dark/50 border border-glass-border rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Hora Fin</label>
                          <input 
                            type="time" 
                            value={tempEndTime} 
                            onChange={(e) => setTempEndTime(e.target.value)} 
                            className="w-full bg-dark/50 border border-glass-border rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-500" 
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={addTimeSlot}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors flex justify-center items-center gap-2 cursor-pointer"
                      >
                        <Plus size={16} /> Añadir Horario
                      </button>
                    </div>
                  ) : (
                    <div className="bg-dark/20 border border-glass-border border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[160px]">
                      <Calendar size={32} className="text-gray-500 mb-2" />
                      <p className="text-gray-400 text-sm">Selecciona una fecha en el calendario para agregar tu disponibilidad.</p>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col min-h-[180px]">
                    <h4 className="text-white font-semibold text-sm mb-3">Horarios Agendados en esta sesión:</h4>
                    <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1 custom-scrollbar">
                      {tempAvailabilityList.length === 0 ? (
                        <p className="text-gray-500 text-xs italic">Aún no has agendado disponibilidad.</p>
                      ) : (
                        [...tempAvailabilityList]
                          .sort((a, b) => {
                            if (a.dateStr !== b.dateStr) return a.dateStr.localeCompare(b.dateStr);
                            return a.startTime.localeCompare(b.startTime);
                          })
                          .map(slot => (
                            <div key={slot.id} className="flex items-center justify-between bg-dark/40 border border-glass-border/60 rounded-xl px-4 py-2.5 text-sm hover:border-purple-500/40 transition-colors">
                              <div className="flex flex-col">
                                <span className="text-white font-medium text-xs">{getFriendlyDate(slot.dateStr)}</span>
                                <span className="text-purple-300 text-xs flex items-center gap-1 mt-0.5 font-semibold">
                                  <Clock size={12} className="text-purple-400" /> {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => removeTimeSlot(slot.id)}
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 border-t border-glass-border pt-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowCalendarModal(false)}
                  className="flex-1 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium border border-glass-border cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirmAvailability}
                  className="flex-1 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  Confirmar Disponibilidad
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {reschedulingClass && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/95 backdrop-blur-sm"
              onClick={() => setReschedulingClass(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative z-10"
            >
              <div className="flex justify-between items-center mb-4 border-b border-glass-border pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Reprogramar Clase
                </h3>
                <button onClick={() => setReschedulingClass(null)} className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div className="text-xs text-gray-400 space-y-1 bg-dark/30 border border-glass-border/40 p-3 rounded-xl">
                  <p><strong className="text-gray-300">Clase:</strong> {reschedulingClass.request?.target_skill?.title}</p>
                  <p><strong className="text-gray-300">Horario Anterior:</strong> {getFriendlyDate(reschedulingClass.date)} a las {reschedulingClass.time}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nueva Fecha</label>
                  <input 
                    type="date" 
                    required 
                    min={formatDateKey(new Date())}
                    value={newClassDate} 
                    onChange={(e) => setNewClassDate(e.target.value)} 
                    className="w-full bg-dark/50 border border-glass-border rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nuevo Horario (Rango)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. 14:00 - 16:00"
                    value={newClassTime} 
                    onChange={(e) => setNewClassTime(e.target.value)} 
                    className="w-full bg-dark/50 border border-glass-border rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setReschedulingClass(null)}
                    className="flex-1 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium border border-glass-border cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-900/40 cursor-pointer text-sm"
                  >
                    Confirmar Cambio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/95 backdrop-blur-sm"
              onClick={() => !savingSettings && setShowSettingsModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl p-6 relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-glass-border pb-4">
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  <Settings className="text-purple-400" /> Ajustes de Perfil
                </h3>
                <button 
                  onClick={() => setShowSettingsModal(false)} 
                  disabled={savingSettings}
                  className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Profile Photo Selector */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Foto de Perfil</label>
                  
                  {/* Current Preview */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-glass-border bg-dark/30 flex items-center justify-center">
                      {settingsAvatarUrl ? (
                        <img src={settingsAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                          {settingsName.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Selecciona uno de nuestros avatares artísticos o ingresa una URL personalizada abajo.</p>
                    </div>
                  </div>

                  {/* Predefined Avatars Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 bg-dark/30 p-3 border border-glass-border/40 rounded-xl">
                    {[
                      'Felix', 'Aneka', 'Milo', 'Tigger', 'Buster', 'Jack', 'Coco', 'Lilly'
                    ].map(seed => {
                      const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                      const isSelected = settingsAvatarUrl === url;
                      return (
                        <button
                          key={seed}
                          type="button"
                          onClick={() => setSettingsAvatarUrl(url)}
                          className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${
                            isSelected ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-glass-border hover:border-gray-400'
                          }`}
                        >
                          <img src={url} alt={seed} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom URL Input */}
                  <div>
                    <input 
                      type="url" 
                      placeholder="Pegar URL de foto personalizada (ej. de Unsplash o Imgur)" 
                      value={settingsAvatarUrl}
                      onChange={(e) => setSettingsAvatarUrl(e.target.value)}
                      className="w-full bg-dark/50 border border-glass-border rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-purple-500 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      required 
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
                    <input 
                      type="text" 
                      value={settingsSurname}
                      onChange={(e) => setSettingsSurname(e.target.value)}
                      placeholder="Ej. Pérez"
                      className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Location Autocomplete (Ciudad y País) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Ubicación (Ciudad y País)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Escribe para buscar ubicación..."
                    value={locationQuery}
                    onChange={(e) => searchLocation(e.target.value)}
                    className="w-full bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                  {searchingLocation && (
                    <span className="absolute right-4 top-10 text-xs text-purple-400 animate-pulse">Buscando...</span>
                  )}
                  {locationSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-dark-card border border-glass-border rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto divide-y divide-glass-border">
                      {locationSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSettingsCity(item.display);
                            setLocationQuery(item.display);
                            setLocationSuggestions([]);
                          }}
                          className="w-full text-left py-2.5 px-4 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          {item.display}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Password Change Grid */}
                <div className="border-t border-glass-border pt-4 space-y-4">
                  <h4 className="text-white font-semibold text-sm">Cambiar Contraseña (Dejar en blanco si no deseas cambiarla)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Nueva Contraseña</label>
                      <input 
                        type="password" 
                        placeholder="Nueva contraseña"
                        value={settingsPassword}
                        onChange={(e) => setSettingsPassword(e.target.value)}
                        className="w-full bg-dark/50 border border-glass-border rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Confirmar Nueva Contraseña</label>
                      <input 
                        type="password" 
                        placeholder="Confirmar contraseña"
                        value={settingsConfirmPassword}
                        onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                        className="w-full bg-dark/50 border border-glass-border rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 border-t border-glass-border pt-4 mt-6">
                  <button 
                    type="button" 
                    disabled={savingSettings}
                    onClick={() => setShowSettingsModal(false)}
                    className="flex-1 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium border border-glass-border cursor-pointer text-sm disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={savingSettings}
                    className="flex-1 py-3 bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-900/40 cursor-pointer text-sm"
                  >
                    {savingSettings ? 'Guardando...' : 'Guardar Ajustes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && ratingClass && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/95 backdrop-blur-sm"
              onClick={() => !submittingReview && setShowReviewModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative z-10"
            >
              <div className="flex justify-between items-center mb-4 border-b border-glass-border pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Calificar Intercambio
                </h3>
                <button 
                  onClick={() => setShowReviewModal(false)} 
                  disabled={submittingReview}
                  className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div className="text-xs text-gray-400 space-y-1 bg-dark/30 border border-glass-border/40 p-3 rounded-xl">
                  <p><strong className="text-gray-300">Profesor:</strong> {ratingClass.teacher?.name}</p>
                  <p><strong className="text-gray-300">Habilidad:</strong> {ratingClass.request?.target_skill?.title}</p>
                </div>

                <div className="text-center space-y-2">
                  <label className="block text-sm font-medium text-gray-300">¿Cómo calificarías la clase?</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition-all duration-150 cursor-pointer ${
                          star <= reviewRating 
                            ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' 
                            : 'text-gray-600 hover:text-yellow-500'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-purple-400 font-semibold">
                    {reviewRating === 1 && "Muy insatisfecho"}
                    {reviewRating === 2 && "Insatisfecho"}
                    {reviewRating === 3 && "Aceptable"}
                    {reviewRating === 4 && "Muy bueno"}
                    {reviewRating === 5 && "¡Excelente experiencia!"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Comentario / Reseña (Opcional)</label>
                  <textarea 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Cuéntanos qué tal fue la explicación, el trato, etc..."
                    className="w-full h-24 bg-dark/50 border border-glass-border rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-purple-500 resize-none placeholder-gray-600"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    disabled={submittingReview}
                    onClick={() => setShowReviewModal(false)}
                    className="flex-grow py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium border border-glass-border cursor-pointer text-sm"
                  >
                    Omitir
                  </button>
                  <button 
                    type="submit"
                    disabled={submittingReview}
                    className="flex-grow py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-900/40 cursor-pointer text-sm"
                  >
                    {submittingReview ? 'Guardando...' : 'Enviar Calificación'}
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

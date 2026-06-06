import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means visitante
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let initialLoadDone = false;

    // Fallback de seguridad: si Supabase tarda más de 2 segundos en responder (por un bloqueo de Web Locks del navegador)
    // forzamos el fin de la carga para que la app no se quede en pantalla negra.
    const timeoutId = setTimeout(() => {
      if (isMounted && !initialLoadDone) {
        console.warn("Supabase auth timeout, forzando renderizado...");
        setLoading(false);
      }
    }, 2000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      try {
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error al actualizar estado de sesión:", err);
      } finally {
        initialLoadDone = true;
        setLoading(false);
        clearTimeout(timeoutId);
      }
    });

    // Evento focus: si el usuario vuelve a la pestaña después de un rato de inactividad,
    // forzamos la actualización de la sesión y perfil para evitar JWT expirados.
    const handleFocus = async () => {
      if (!isMounted) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user);
        }
      } catch (err) {
        console.error("Error al refrescar sesión en focus:", err);
      }
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchProfile = async (authUser) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (data) {
      setUser({
        ...authUser,
        ...data,
      });
    } else if (error && error.code === 'PGRST116') {
      // PGRST116 is "Results contain 0 rows"
      // This happens the first time a user logs in via Google
      const name = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuario';
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: authUser.id, name: name, city: 'No especificada' }])
        .select()
        .single();
        
      if (!insertError && newProfile) {
        setUser({ ...authUser, ...newProfile });
      } else {
        console.error("Error creating profile for OAuth user:", insertError);
        setUser(authUser);
      }
    } else {
      setUser(authUser);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return true;
  };

  const register = async (userData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    if (error) throw error;

    if (authData?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: `${userData.name} ${userData.surname || ''}`.trim(),
            city: userData.city,
          }
        ]);
        
      if (profileError) throw profileError;
    }
    return true;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await fetchProfile(authUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, refreshUser, loading }}>
      {loading ? (
        <div className="min-h-screen pt-24 px-6 flex items-center justify-center text-white text-2xl">
          Conectando con Supabase...
        </div>
      ) : user?.is_banned ? (
        <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
          <div className="glass p-12 max-w-lg border border-red-500/30 rounded-2xl">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Cuenta Suspendida</h2>
            <p className="text-gray-300 mb-8">
              Tu cuenta ha sido suspendida por un administrador debido a infracciones de los términos de servicio.
            </p>
            <button 
              onClick={logout} 
              className="px-6 py-3 bg-red-600/20 border border-red-500/30 hover:bg-red-600/40 text-red-400 rounded-xl font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

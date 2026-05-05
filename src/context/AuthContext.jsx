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

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
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

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {loading ? (
        <div className="min-h-screen pt-24 px-6 flex items-center justify-center text-white text-2xl">
          Conectando con Supabase...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

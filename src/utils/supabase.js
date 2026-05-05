import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Prevenir múltiples instancias durante el Hot Reload de Vite que causan deadlocks de Web Locks
if (!window._supabaseInstance) {
  window._supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: 'skillswap-auth',
      persistSession: true,
      // Deshabilitar completamente los Web Locks del navegador que están causando el cuelgue:
      lock: async (name, acquireTimeout, fn) => {
        return await fn();
      }
    }
  });
}

export const supabase = window._supabaseInstance;

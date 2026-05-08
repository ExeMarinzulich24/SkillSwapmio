-- ARCHIVO MERAMENTE PARA PODER HACER CAMBIOS EN LA BASE DE DATOS SOLO SIRVE DE REFERENCIA PARA EDITAR EN UN FUTURO--

-- Creación de la tabla Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Profiles son públicos" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Usuarios pueden insertar su propio perfil" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Creación de la tabla Skills
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  modality TEXT NOT NULL,
  availability TEXT NOT NULL,
  level TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Políticas para skills
CREATE POLICY "Skills son públicas" 
ON skills FOR SELECT 
USING (true);

CREATE POLICY "Usuarios pueden crear sus propias skills" 
ON skills FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Usuarios pueden actualizar sus propias skills" 
ON skills FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Usuarios pueden eliminar sus propias skills" 
ON skills FOR DELETE 
USING (auth.uid() = owner_id);

-- Create registrations table for event registration
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  escola TEXT NOT NULL,
  dia TEXT NOT NULL CHECK (dia IN ('dia1', 'dia2', 'ambos')),
  oficina TEXT NOT NULL,
  oficina_option TEXT,
  presente BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add unique constraint to prevent duplicate registrations
  UNIQUE(email, dia, oficina)
);

-- Enable RLS on registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for registrations (public access for this event system)
CREATE POLICY "registrations_select_all" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "registrations_insert_all" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "registrations_update_all" ON public.registrations FOR UPDATE USING (true);
CREATE POLICY "registrations_delete_all" ON public.registrations FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_dia ON public.registrations(dia);
CREATE INDEX IF NOT EXISTS idx_registrations_oficina ON public.registrations(oficina);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at);

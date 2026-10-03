-- Create registrations table for event registration system
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  escola TEXT NOT NULL,
  dia TEXT NOT NULL,
  oficina TEXT NOT NULL,
  oficina_option TEXT,
  presente BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_dia ON public.registrations(dia);
CREATE INDEX IF NOT EXISTS idx_registrations_oficina ON public.registrations(oficina);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an event registration system)
-- Allow anyone to insert registrations (public registration)
CREATE POLICY "Allow public registration insertion" ON public.registrations
  FOR INSERT WITH CHECK (true);

-- Allow reading all registrations (for admin dashboard)
CREATE POLICY "Allow reading all registrations" ON public.registrations
  FOR SELECT USING (true);

-- Allow updating registrations (for attendance marking)
CREATE POLICY "Allow updating registrations" ON public.registrations
  FOR UPDATE USING (true);

-- Allow deleting registrations (for admin management)
CREATE POLICY "Allow deleting registrations" ON public.registrations
  FOR DELETE USING (true);

-- Add unique constraint to prevent duplicate registrations
CREATE UNIQUE INDEX IF NOT EXISTS unique_registration_per_workshop 
ON public.registrations(email, dia, oficina, COALESCE(oficina_option, ''));

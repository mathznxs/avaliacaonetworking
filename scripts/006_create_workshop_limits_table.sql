-- Create workshop_limits table for managing workshop capacity
CREATE TABLE IF NOT EXISTS public.workshop_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_name TEXT NOT NULL,
  workshop_option TEXT,
  day TEXT NOT NULL CHECK (day IN ('dia1', 'dia2', 'ambos')),
  max_capacity INTEGER NOT NULL DEFAULT 50,
  current_registrations INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint for workshop/day combination
  UNIQUE(workshop_name, workshop_option, day)
);

-- Enable RLS on workshop_limits
ALTER TABLE public.workshop_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for workshop_limits (public read, admin write)
CREATE POLICY "workshop_limits_select_all" ON public.workshop_limits FOR SELECT USING (true);
CREATE POLICY "workshop_limits_insert_all" ON public.workshop_limits FOR INSERT WITH CHECK (true);
CREATE POLICY "workshop_limits_update_all" ON public.workshop_limits FOR UPDATE USING (true);
CREATE POLICY "workshop_limits_delete_all" ON public.workshop_limits FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workshop_limits_name ON public.workshop_limits(workshop_name);
CREATE INDEX IF NOT EXISTS idx_workshop_limits_day ON public.workshop_limits(day);
CREATE INDEX IF NOT EXISTS idx_workshop_limits_active ON public.workshop_limits(is_active);

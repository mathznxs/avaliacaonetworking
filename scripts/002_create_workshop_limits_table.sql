-- Create workshop_limits table for managing workshop capacity
CREATE TABLE IF NOT EXISTS public.workshop_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_name TEXT NOT NULL,
  workshop_option TEXT,
  day TEXT NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 0,
  current_registrations INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workshop_limits_name ON public.workshop_limits(workshop_name);
CREATE INDEX IF NOT EXISTS idx_workshop_limits_day ON public.workshop_limits(day);
CREATE INDEX IF NOT EXISTS idx_workshop_limits_active ON public.workshop_limits(is_active);

-- Enable Row Level Security
ALTER TABLE public.workshop_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for workshop limits
-- Allow reading workshop limits (for capacity checking)
CREATE POLICY "Allow reading workshop limits" ON public.workshop_limits
  FOR SELECT USING (true);

-- Allow updating workshop limits (for capacity management)
CREATE POLICY "Allow updating workshop limits" ON public.workshop_limits
  FOR UPDATE USING (true);

-- Allow inserting workshop limits (for admin setup)
CREATE POLICY "Allow inserting workshop limits" ON public.workshop_limits
  FOR INSERT WITH CHECK (true);

-- Allow deleting workshop limits (for admin management)
CREATE POLICY "Allow deleting workshop limits" ON public.workshop_limits
  FOR DELETE USING (true);

-- Add unique constraint for workshop limits
CREATE UNIQUE INDEX IF NOT EXISTS unique_workshop_limit 
ON public.workshop_limits(workshop_name, day, COALESCE(workshop_option, ''));

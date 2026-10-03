-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for workshop_limits table
DROP TRIGGER IF EXISTS update_workshop_limits_updated_at ON public.workshop_limits;
CREATE TRIGGER update_workshop_limits_updated_at
    BEFORE UPDATE ON public.workshop_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

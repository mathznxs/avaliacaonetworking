-- Create trigger for registrations updated_at
DROP TRIGGER IF EXISTS update_registrations_updated_at ON public.registrations;
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for workshop_limits updated_at
DROP TRIGGER IF EXISTS update_workshop_limits_updated_at ON public.workshop_limits;
CREATE TRIGGER update_workshop_limits_updated_at
  BEFORE UPDATE ON public.workshop_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update workshop registration counts
CREATE OR REPLACE FUNCTION public.update_workshop_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update current_registrations count for the affected workshop
  IF TG_OP = 'INSERT' THEN
    UPDATE public.workshop_limits 
    SET current_registrations = (
      SELECT COUNT(*) 
      FROM public.registrations 
      WHERE oficina = NEW.oficina 
      AND dia = NEW.dia
      AND (oficina_option = NEW.oficina_option OR (oficina_option IS NULL AND NEW.oficina_option IS NULL))
    )
    WHERE workshop_name = NEW.oficina 
    AND day = NEW.dia
    AND (workshop_option = NEW.oficina_option OR (workshop_option IS NULL AND NEW.oficina_option IS NULL));
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE public.workshop_limits 
    SET current_registrations = (
      SELECT COUNT(*) 
      FROM public.registrations 
      WHERE oficina = OLD.oficina 
      AND dia = OLD.dia
      AND (oficina_option = OLD.oficina_option OR (oficina_option IS NULL AND OLD.oficina_option IS NULL))
    )
    WHERE workshop_name = OLD.oficina 
    AND day = OLD.dia
    AND (workshop_option = OLD.oficina_option OR (workshop_option IS NULL AND OLD.oficina_option IS NULL));
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic count updates
DROP TRIGGER IF EXISTS update_workshop_counts_insert ON public.registrations;
CREATE TRIGGER update_workshop_counts_insert
  AFTER INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workshop_counts();

DROP TRIGGER IF EXISTS update_workshop_counts_delete ON public.registrations;
CREATE TRIGGER update_workshop_counts_delete
  AFTER DELETE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workshop_counts();

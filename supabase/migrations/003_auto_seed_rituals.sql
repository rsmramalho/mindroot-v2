-- 003_auto_seed_rituals.sql
-- Auto-seed default rituals when a new user signs up.
-- Uses a Postgres trigger on auth.users to insert starter items.
--
-- COMO APLICAR:
-- 1. Abrir Supabase Dashboard → SQL Editor
-- 2. Colar e rodar este SQL
-- 3. Testar: criar novo user → verificar que 8 rituais foram criados

-- ═══════════════════════════════════════════════
-- FUNCTION: seed rituals for new user
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.seed_new_user_rituals()
RETURNS TRIGGER AS $$
BEGIN
  -- Aurora rituals (5h-12h)
  INSERT INTO public.items (user_id, title, type, ritual_period, recurrence, module, needs_checkin)
  VALUES
    (NEW.id, 'Intenção do dia',         'ritual', 'aurora', 'daily', 'purpose', true),
    (NEW.id, 'Respiração consciente',   'ritual', 'aurora', 'daily', 'body',    false),
    (NEW.id, 'Prioridades do dia',      'ritual', 'aurora', 'daily', 'mind',    false);

  -- Zênite rituals (12h-18h)
  INSERT INTO public.items (user_id, title, type, ritual_period, recurrence, module, needs_checkin)
  VALUES
    (NEW.id, 'Pausa de recalibração',   'ritual', 'zenite', 'daily', 'mind',    true),
    (NEW.id, 'Check-in emocional',      'ritual', 'zenite', 'daily', 'soul',    true);

  -- Crepúsculo rituals (18h-5h)
  INSERT INTO public.items (user_id, title, type, ritual_period, recurrence, module, needs_checkin)
  VALUES
    (NEW.id, 'Gratidão do dia',         'ritual', 'crepusculo', 'daily', 'soul',    true),
    (NEW.id, 'Revisão do dia',          'ritual', 'crepusculo', 'daily', 'purpose', true),
    (NEW.id, 'Preparação para amanhã',  'ritual', 'crepusculo', 'daily', 'mind',    false);

  -- Starter task (so Dashboard isn't empty)
  INSERT INTO public.items (user_id, title, type, module, priority, needs_checkin)
  VALUES
    (NEW.id, 'Explorar o MindRoot', 'task', 'mind', 'importante', false);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════
-- TRIGGER: fires after new user creation
-- ═══════════════════════════════════════════════

-- Drop if exists (safe re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_new_user_rituals();

-- ═══════════════════════════════════════════════
-- GRANT: function needs insert permission
-- ═══════════════════════════════════════════════

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT ON public.items TO supabase_auth_admin;

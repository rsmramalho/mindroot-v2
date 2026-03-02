-- seed_rituals.sql
-- ⚠️  Substitua YOUR_USER_ID pelo UUID do seu user no Supabase Auth
-- Rode no SQL Editor do Supabase Dashboard

DO $$
DECLARE
  uid UUID := 'YOUR_USER_ID'; -- ← TROCAR AQUI
BEGIN
  -- Aurora rituals
  INSERT INTO public.items (user_id, title, type, ritual_period, recurrence, module, needs_checkin)
  VALUES
    (uid, 'Intenção do dia',         'ritual', 'aurora', 'daily', 'purpose', true),
    (uid, 'Respiração consciente',   'ritual', 'aurora', 'daily', 'body',    false),
    (uid, 'Prioridades do dia',      'ritual', 'aurora', 'daily', 'mind',    false);

  -- Zênite rituals
  INSERT INTO public.items (user_id, title, type, ritual_period, recurrence, module, needs_checkin)
  VALUES
    (uid, 'Pausa de recalibração',   'ritual', 'zenite', 'daily', 'mind',    true),
    (uid, 'Check-in emocional',      'ritual', 'zenite', 'daily', 'soul',    true);

  -- Crepúsculo rituals
  INSERT INTO public.items (user_id, title, type, ritual_period, recurrence, module, needs_checkin)
  VALUES
    (uid, 'Gratidão do dia',         'ritual', 'crepusculo', 'daily', 'soul',    true),
    (uid, 'Revisão do dia',          'ritual', 'crepusculo', 'daily', 'purpose', true),
    (uid, 'Preparação para amanhã',  'ritual', 'crepusculo', 'daily', 'mind',    false);
END $$;

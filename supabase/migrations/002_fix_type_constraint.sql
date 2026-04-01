-- 002_fix_type_constraint.sql
-- Fix: DB constraint only accepts (task, habit, note, reflection)
-- but frontend needs (task, habit, ritual, chore, project, note, reflection, journal)
--
-- COMO APLICAR:
-- 1. Abrir Supabase Dashboard → SQL Editor
-- 2. Colar e rodar este SQL
-- 3. Testar: INSERT INTO items (..., type) VALUES (..., 'project') deve funcionar

-- Drop the old constraint
ALTER TABLE public.items DROP CONSTRAINT IF EXISTS items_type_check;

-- Re-create with ALL valid types
ALTER TABLE public.items ADD CONSTRAINT items_type_check
  CHECK (type IN ('task','habit','ritual','chore','project','note','reflection','journal'));

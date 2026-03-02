-- 001_core_schema.sql
-- MindRoot — Core schema com Soul Layer
-- Supabase project: avvwjkzkzklloyfugzer

-- ═══════════════════════════════════════════════
-- TABELA PRINCIPAL: items (Single Table Design)
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'task'
    CHECK (type IN ('task','habit','ritual','chore','project','note','reflection','journal')),
  module TEXT
    CHECK (module IS NULL OR module IN ('purpose','work','family','body','mind','soul')),
  priority TEXT
    CHECK (priority IS NULL OR priority IN ('urgente','importante','manutencao','futuro')),
  tags TEXT[] DEFAULT '{}',

  -- Hierarchy
  parent_id UUID REFERENCES public.items(id) ON DELETE SET NULL,

  -- Status
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  archived BOOLEAN NOT NULL DEFAULT FALSE,

  -- Temporal
  due_date DATE,
  due_time TIME,
  recurrence TEXT,

  -- Ritual
  ritual_period TEXT CHECK (ritual_period IS NULL OR ritual_period IN ('aurora','zenite','crepusculo')),

  -- ★ Soul Layer
  emotion_before TEXT,
  emotion_after TEXT,
  needs_checkin BOOLEAN NOT NULL DEFAULT FALSE,
  is_chore BOOLEAN NOT NULL DEFAULT FALSE,
  energy_cost SMALLINT CHECK (energy_cost IS NULL OR (energy_cost >= 1 AND energy_cost <= 5)),

  -- Content
  description TEXT,
  context TEXT,

  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════
-- ÍNDICES
-- ═══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(type);
CREATE INDEX IF NOT EXISTS idx_items_module ON public.items(module) WHERE module IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_due_date ON public.items(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_parent_id ON public.items(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_completed ON public.items(completed) WHERE completed = FALSE;
CREATE INDEX IF NOT EXISTS idx_items_emotion_before ON public.items(emotion_before) WHERE emotion_before IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_needs_checkin ON public.items(needs_checkin) WHERE needs_checkin = TRUE;
CREATE INDEX IF NOT EXISTS idx_items_is_chore ON public.items(is_chore) WHERE is_chore = TRUE;
CREATE INDEX IF NOT EXISTS idx_items_priority ON public.items(priority) WHERE priority IS NOT NULL;

-- ═══════════════════════════════════════════════
-- RLS (Row Level Security)
-- ═══════════════════════════════════════════════

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own items"
  ON public.items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON public.items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON public.items FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════
-- TRIGGER: updated_at automático
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_items_updated
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

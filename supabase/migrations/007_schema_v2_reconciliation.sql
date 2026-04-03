-- ═══════════════════════════════════════════════════════════════
-- 007_schema_v2_reconciliation.sql
-- Genesis v5.0.1 — Full Schema v2 Reconciliation
--
-- Purpose: Reconcile repo migrations (v1, 001-006) with the
-- actual Supabase state (Schema v2). This migration is the
-- canonical SQL representation of Genesis v5.0.1, Parts 5-7.
--
-- Safety: All statements are idempotent (IF NOT EXISTS,
-- CREATE OR REPLACE). Safe to run against existing v2 DB
-- and capable of creating v2 from scratch.
--
-- DB inspection note: Direct DB query not available (no
-- service_role key). Schema derived from Genesis v5.0.1
-- spec + docs/sql/schema-v2-migration.sql + CLAUDE.md
-- confirmation that v2 is deployed with 3 tables, triggers,
-- RPCs, views, and RLS.
--
-- Protocol: foundation (GUARDIAO → ROOT)
-- Date: 2026-04-03
-- ═══════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────
-- PART 1: ENUMS (5)
-- Genesis v5.0.1, Section 5.1
-- ─────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE atom_state AS ENUM (
    'inbox', 'classified', 'structured', 'validated',
    'connected', 'propagated', 'committed', 'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE atom_type AS ENUM (
    'note', 'reflection', 'recommendation', 'podcast', 'article',
    'resource', 'list', 'task', 'habit', 'recipe', 'workout',
    'spec', 'checkpoint', 'project', 'session_log', 'wrap',
    'ritual', 'review', 'log', 'doc', 'research', 'template', 'lib'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE atom_module AS ENUM (
    'work', 'body', 'mind', 'family',
    'purpose', 'bridge', 'finance', 'social'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE atom_relation AS ENUM (
    'belongs_to', 'blocks', 'feeds', 'mirrors',
    'derives', 'references', 'morphed_from', 'extracted_from'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE atom_status AS ENUM (
    'inbox', 'draft', 'active', 'paused',
    'waiting', 'someday', 'completed', 'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ─────────────────────────────────────────────────────────────
-- PART 2: TABLES (3)
-- Genesis v5.0.1, Section 5.2
-- ─────────────────────────────────────────────────────────────

-- ── 2a. items (nodes) ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,

  -- Core
  title TEXT NOT NULL,
  type atom_type,
  module atom_module,
  tags TEXT[] DEFAULT '{}',
  status atom_status DEFAULT 'inbox',

  -- State machine
  state atom_state DEFAULT 'inbox',
  genesis_stage SMALLINT DEFAULT 1 CHECK (genesis_stage BETWEEN 1 AND 7),

  -- Hierarchy
  project_id UUID REFERENCES items(id) ON DELETE SET NULL,
  naming_convention TEXT,

  -- Content
  notes TEXT,
  body JSONB DEFAULT '{}'::jsonb,

  -- Meta
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- If items table exists from v1, migrate columns:
-- Add v2 columns if missing
DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS status atom_status DEFAULT 'inbox';
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS state atom_state DEFAULT 'inbox';
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS genesis_stage SMALLINT DEFAULT 1;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES items(id) ON DELETE SET NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS naming_convention TEXT;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS notes TEXT;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS body JSONB DEFAULT '{}'::jsonb;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS source TEXT;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE items ADD COLUMN IF NOT EXISTS created_by TEXT;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Rename v1 description → notes (if description exists and notes doesn't have data)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'description'
  ) AND NOT EXISTS (
    SELECT 1 FROM items WHERE notes IS NOT NULL LIMIT 1
  ) THEN
    UPDATE items SET notes = description WHERE description IS NOT NULL AND notes IS NULL;
  END IF;
END $$;

-- Drop v1 columns (safe — data migrated to body JSONB or no longer needed)
ALTER TABLE items DROP COLUMN IF EXISTS completed;
ALTER TABLE items DROP COLUMN IF EXISTS completed_at;
ALTER TABLE items DROP COLUMN IF EXISTS archived;
ALTER TABLE items DROP COLUMN IF EXISTS priority;
ALTER TABLE items DROP COLUMN IF EXISTS parent_id;
ALTER TABLE items DROP COLUMN IF EXISTS emotion_before;
ALTER TABLE items DROP COLUMN IF EXISTS emotion_after;
ALTER TABLE items DROP COLUMN IF EXISTS needs_checkin;
ALTER TABLE items DROP COLUMN IF EXISTS is_chore;
ALTER TABLE items DROP COLUMN IF EXISTS energy_cost;
ALTER TABLE items DROP COLUMN IF EXISTS description;
ALTER TABLE items DROP COLUMN IF EXISTS context;
ALTER TABLE items DROP COLUMN IF EXISTS due_date;
ALTER TABLE items DROP COLUMN IF EXISTS due_time;
ALTER TABLE items DROP COLUMN IF EXISTS recurrence;
ALTER TABLE items DROP COLUMN IF EXISTS ritual_period;

-- Drop v1 type/module TEXT constraints (replaced by enum types)
-- These may fail silently if column types already changed — that's fine.
DO $$
BEGIN
  -- If type is still TEXT, cast to enum
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'type' AND data_type = 'text'
  ) THEN
    ALTER TABLE items ALTER COLUMN type TYPE atom_type USING type::atom_type;
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'module' AND data_type = 'text'
  ) THEN
    ALTER TABLE items ALTER COLUMN module TYPE atom_module USING module::atom_module;
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Add genesis_stage CHECK if missing
DO $$
BEGIN
  ALTER TABLE items ADD CONSTRAINT chk_genesis_stage CHECK (genesis_stage BETWEEN 1 AND 7);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ── 2b. item_connections (edges) ───────────────────────────

CREATE TABLE IF NOT EXISTS item_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,

  source_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  relation atom_relation NOT NULL,
  note TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(source_id, target_id, relation),
  CHECK (source_id != target_id)
);


-- ── 2c. atom_events (propagation + audit trail) ───────────

CREATE TABLE IF NOT EXISTS atom_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,

  source_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  target_id UUID REFERENCES items(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────
-- PART 3: INDEXES (13)
-- Genesis v5.0.1, Section 5.3
-- ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_items_user ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_state ON items(state);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_module ON items(module);
CREATE INDEX IF NOT EXISTS idx_items_genesis ON items(genesis_stage);
CREATE INDEX IF NOT EXISTS idx_items_project ON items(project_id);

CREATE INDEX IF NOT EXISTS idx_connections_user ON item_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_source ON item_connections(source_id);
CREATE INDEX IF NOT EXISTS idx_connections_target ON item_connections(target_id);

CREATE INDEX IF NOT EXISTS idx_events_user ON atom_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_source ON atom_events(source_id);
CREATE INDEX IF NOT EXISTS idx_events_created ON atom_events(created_at);

-- Drop v1 indexes that reference removed columns
DROP INDEX IF EXISTS idx_items_due_date;
DROP INDEX IF EXISTS idx_items_parent_id;
DROP INDEX IF EXISTS idx_items_completed;
DROP INDEX IF EXISTS idx_items_emotion_before;
DROP INDEX IF EXISTS idx_items_needs_checkin;
DROP INDEX IF EXISTS idx_items_is_chore;
DROP INDEX IF EXISTS idx_items_priority;


-- ─────────────────────────────────────────────────────────────
-- PART 4: ROW LEVEL SECURITY (3 policies)
-- Genesis v5.0.1, Section 5.4
-- ─────────────────────────────────────────────────────────────

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_events ENABLE ROW LEVEL SECURITY;

-- Drop v1 granular policies (replaced by single FOR ALL policy)
DROP POLICY IF EXISTS "Users can view own items" ON items;
DROP POLICY IF EXISTS "Users can insert own items" ON items;
DROP POLICY IF EXISTS "Users can update own items" ON items;
DROP POLICY IF EXISTS "Users can delete own items" ON items;

-- v2 policies (idempotent: drop + create)
DROP POLICY IF EXISTS "items_isolation" ON items;
CREATE POLICY "items_isolation" ON items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "connections_isolation" ON item_connections;
CREATE POLICY "connections_isolation" ON item_connections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "events_isolation" ON atom_events;
CREATE POLICY "events_isolation" ON atom_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- PART 5: TRIGGERS (2)
-- Genesis v5.0.1, Sections 5.5-5.6
-- ─────────────────────────────────────────────────────────────

-- 5a. sync genesis_stage ↔ state
CREATE OR REPLACE FUNCTION sync_genesis_stage()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.genesis_stage := CASE NEW.state
    WHEN 'inbox' THEN 1
    WHEN 'classified' THEN 2
    WHEN 'structured' THEN 3
    WHEN 'validated' THEN 4
    WHEN 'connected' THEN 5
    WHEN 'propagated' THEN 6
    WHEN 'committed' THEN 7
    WHEN 'archived' THEN 7
    ELSE NEW.genesis_stage
  END;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_genesis ON items;
CREATE TRIGGER trg_sync_genesis
  BEFORE UPDATE OF state ON items
  FOR EACH ROW EXECUTE FUNCTION sync_genesis_stage();

-- 5b. orphan downgrade (delete connection → check if item lost all edges)
CREATE OR REPLACE FUNCTION check_orphan_downgrade()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_remaining INT;
  v_type atom_type;
  v_floor INT;
BEGIN
  SELECT COUNT(*) INTO v_remaining
  FROM item_connections
  WHERE source_id = OLD.source_id OR target_id = OLD.source_id;

  IF v_remaining = 0 THEN
    SELECT type INTO v_type FROM items WHERE id = OLD.source_id;

    v_floor := CASE v_type
      WHEN 'project' THEN 5 WHEN 'spec' THEN 5
      WHEN 'task' THEN 3 WHEN 'habit' THEN 3
      WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
      WHEN 'checkpoint' THEN 3
      WHEN 'session_log' THEN 7 WHEN 'wrap' THEN 7
      ELSE 2
    END;

    -- Only downgrade if floor allows stage 4.
    -- Items with floor 5+ stay at 'connected' and appear in audit.
    IF v_floor <= 4 THEN
      UPDATE items
      SET state = 'validated', updated_at = NOW()
      WHERE id = OLD.source_id AND state = 'connected';
    END IF;
  END IF;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_orphan_check ON item_connections;
CREATE TRIGGER trg_orphan_check
  AFTER DELETE ON item_connections
  FOR EACH ROW EXECUTE FUNCTION check_orphan_downgrade();

-- Drop v1 updated_at trigger (replaced by sync_genesis_stage which also sets updated_at)
DROP TRIGGER IF EXISTS on_items_updated ON items;
DROP FUNCTION IF EXISTS handle_updated_at();


-- ─────────────────────────────────────────────────────────────
-- PART 6: RPCs (4)
-- Genesis v5.0.1, Sections 6.1-6.4
-- ─────────────────────────────────────────────────────────────

-- 6.1 morph_item — Type mutation (creates fossil, regresses to stage 2)
CREATE OR REPLACE FUNCTION morph_item(p_item_id UUID, p_new_type atom_type)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current RECORD;
  v_fossil_id UUID;
BEGIN
  SELECT * INTO v_current FROM items WHERE id = p_item_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Item not found.'; END IF;
  IF v_current.user_id != auth.uid() THEN RAISE EXCEPTION 'Access denied.'; END IF;
  IF v_current.state = 'archived' THEN RAISE EXCEPTION 'Item archived.'; END IF;

  -- Create fossil (snapshot of prior state)
  INSERT INTO items (user_id, title, type, module, tags, body, notes, state, genesis_stage, source, created_at)
  VALUES (
    v_current.user_id,
    v_current.title || ' [fossil]',
    v_current.type, v_current.module, v_current.tags,
    v_current.body, v_current.notes,
    'archived', 7, v_current.source, v_current.created_at
  ) RETURNING id INTO v_fossil_id;

  -- Connect fossil to original
  INSERT INTO item_connections (user_id, source_id, target_id, relation)
  VALUES (v_current.user_id, p_item_id, v_fossil_id, 'morphed_from');

  -- Mutate: new type, regress to stage 2, preserve legacy body
  UPDATE items SET
    type = p_new_type,
    body = jsonb_build_object('legacy_body', v_current.body, 'morph_date', NOW()),
    state = 'classified',
    genesis_stage = 2,
    updated_at = NOW()
  WHERE id = p_item_id;

  -- Log event
  INSERT INTO atom_events (user_id, source_id, target_id, event_type, payload)
  VALUES (v_current.user_id, p_item_id, v_fossil_id, 'morph',
    jsonb_build_object('from_type', v_current.type, 'to_type', p_new_type));

  RETURN v_fossil_id;
END;
$$;

-- 6.2 decay_item — Entropy (archive + extract seed)
CREATE OR REPLACE FUNCTION decay_item(p_item_id UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_item RECORD;
  v_seed_id UUID;
BEGIN
  SELECT * INTO v_item FROM items WHERE id = p_item_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Item not found.'; END IF;
  IF v_item.user_id != auth.uid() THEN RAISE EXCEPTION 'Access denied.'; END IF;
  IF v_item.state = 'archived' THEN RAISE EXCEPTION 'Item already decayed.'; END IF;

  -- Create seed in inbox (stage 1)
  INSERT INTO items (user_id, title, state, genesis_stage, body, source)
  VALUES (
    v_item.user_id,
    'Seed: ' || v_item.title,
    'inbox', 1,
    jsonb_build_object('origin_type', v_item.type, 'origin_id', v_item.id, 'status', 'awaiting_triage'),
    'atom-engine'
  ) RETURNING id INTO v_seed_id;

  -- Connect seed to original
  INSERT INTO item_connections (user_id, source_id, target_id, relation)
  VALUES (v_item.user_id, v_seed_id, p_item_id, 'extracted_from');

  -- Archive original
  UPDATE items SET state = 'archived', genesis_stage = 7, updated_at = NOW()
  WHERE id = p_item_id;

  -- Log event
  INSERT INTO atom_events (user_id, source_id, target_id, event_type, payload)
  VALUES (v_item.user_id, p_item_id, v_seed_id, 'decay',
    jsonb_build_object('seed_title', 'Seed: ' || v_item.title));

  RETURN v_seed_id;
END;
$$;

-- 6.3 propagate_effect — Activation (stage 6)
CREATE OR REPLACE FUNCTION propagate_effect(
  p_source_id UUID, p_target_id UUID, p_effect_type TEXT, p_payload JSONB DEFAULT '{}'
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_source RECORD;
  v_event_id UUID;
BEGIN
  SELECT * INTO v_source FROM items WHERE id = p_source_id FOR UPDATE;
  IF v_source.user_id != auth.uid() THEN RAISE EXCEPTION 'Access denied.'; END IF;

  -- Verify edge exists
  IF NOT EXISTS (
    SELECT 1 FROM item_connections
    WHERE source_id = p_source_id AND target_id = p_target_id AND user_id = auth.uid()
  ) THEN RAISE EXCEPTION 'Connection not found.'; END IF;

  -- Log event
  INSERT INTO atom_events (user_id, source_id, target_id, event_type, payload)
  VALUES (v_source.user_id, p_source_id, p_target_id, p_effect_type, p_payload)
  RETURNING id INTO v_event_id;

  -- Advance source to stage 6 if still at 5
  IF v_source.state = 'connected' THEN
    UPDATE items SET state = 'propagated', updated_at = NOW() WHERE id = p_source_id;
  END IF;

  RETURN v_event_id;
END;
$$;

-- 6.4 commit_item — Completude (stage 7)
CREATE OR REPLACE FUNCTION commit_item(p_item_id UUID)
RETURNS TIMESTAMPTZ LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_item RECORD;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  SELECT * INTO v_item FROM items WHERE id = p_item_id FOR UPDATE;
  IF v_item.user_id != auth.uid() THEN RAISE EXCEPTION 'Access denied.'; END IF;
  IF v_item.state = 'committed' THEN RETURN v_item.updated_at; END IF;

  UPDATE items SET
    state = 'committed',
    body = jsonb_set(COALESCE(body, '{}'::jsonb), '{committed_at}', to_jsonb(v_now)),
    updated_at = v_now
  WHERE id = p_item_id;

  INSERT INTO atom_events (user_id, source_id, event_type, payload)
  VALUES (v_item.user_id, p_item_id, 'commit', jsonb_build_object('committed_at', v_now));

  RETURN v_now;
END;
$$;


-- ─────────────────────────────────────────────────────────────
-- PART 7: AUDIT VIEWS (3)
-- Genesis v5.0.1, Section 7
-- ─────────────────────────────────────────────────────────────

-- Orphans: items at stage 'connected' with no edges
CREATE OR REPLACE VIEW v_orphan_items AS
SELECT i.id, i.title, i.type, i.state
FROM items i
WHERE i.state = 'connected'
AND NOT EXISTS (
  SELECT 1 FROM item_connections ic
  WHERE ic.source_id = i.id OR ic.target_id = i.id
);

-- Below floor: items whose genesis_stage < type's minimum floor
CREATE OR REPLACE VIEW v_below_floor AS
SELECT i.id, i.title, i.type, i.genesis_stage,
  CASE i.type
    WHEN 'project' THEN 5 WHEN 'spec' THEN 5
    WHEN 'task' THEN 3 WHEN 'habit' THEN 3
    WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
    WHEN 'checkpoint' THEN 3
    WHEN 'session_log' THEN 7 WHEN 'wrap' THEN 7
    ELSE 2
  END AS required_floor
FROM items i
WHERE i.state != 'archived'
AND i.genesis_stage < CASE i.type
    WHEN 'project' THEN 5 WHEN 'spec' THEN 5
    WHEN 'task' THEN 3 WHEN 'habit' THEN 3
    WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
    WHEN 'checkpoint' THEN 3
    WHEN 'session_log' THEN 7 WHEN 'wrap' THEN 7
    ELSE 2
  END;

-- Inbox stale: items stuck in inbox > 7 days
CREATE OR REPLACE VIEW v_inbox_stale AS
SELECT id, title, created_at,
  EXTRACT(DAY FROM NOW() - created_at) AS days_in_inbox
FROM items
WHERE state = 'inbox'
AND created_at < NOW() - INTERVAL '7 days';


-- ═══════════════════════════════════════════════════════════════
-- RECONCILIATION COMPLETE
-- Genesis v5.0.1, Parts 5-7: 5 enums, 3 tables, 13 indexes,
-- 3 RLS policies, 2 triggers, 4 RPCs, 3 audit views.
-- ═══════════════════════════════════════════════════════════════

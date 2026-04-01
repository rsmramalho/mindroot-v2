-- Atom Engine — Schema v2
-- Extracted from Genesis v4.2, Parts 5.1-5.6
-- Target: Supabase (PostgreSQL + auth.users + RLS)

-- 5.1 Enums
CREATE TYPE atom_state AS ENUM (
  'inbox', 'classified', 'structured', 'validated',
  'connected', 'propagated', 'committed', 'archived'
);

CREATE TYPE atom_type AS ENUM (
  'note', 'reflection', 'recommendation', 'podcast', 'article',
  'resource', 'list', 'task', 'habit', 'recipe', 'workout',
  'spec', 'checkpoint', 'project', 'session_log', 'wrap',
  'ritual', 'review', 'log', 'doc', 'research', 'template', 'lib'
);

CREATE TYPE atom_module AS ENUM (
  'work', 'body', 'mind', 'family',
  'purpose', 'bridge', 'finance', 'social'
);

CREATE TYPE atom_relation AS ENUM (
  'belongs_to', 'blocks', 'feeds', 'mirrors',
  'derives', 'references', 'morphed_from', 'extracted_from'
);

CREATE TYPE atom_status AS ENUM (
  'inbox', 'draft', 'active', 'paused',
  'waiting', 'someday', 'completed', 'archived'
);

-- 5.2 Tables
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  title TEXT NOT NULL,
  type atom_type,
  module atom_module,
  tags TEXT[] DEFAULT '{}',
  status atom_status DEFAULT 'inbox',
  state atom_state DEFAULT 'inbox',
  genesis_stage SMALLINT DEFAULT 1 CHECK (genesis_stage BETWEEN 1 AND 7),
  project_id UUID REFERENCES items(id) ON DELETE SET NULL,
  naming_convention TEXT,
  notes TEXT,
  body JSONB DEFAULT '{}'::jsonb,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

CREATE TABLE item_connections (
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

CREATE TABLE atom_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  source_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  target_id UUID REFERENCES items(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.3 Indexes
CREATE INDEX idx_items_user ON items(user_id);
CREATE INDEX idx_items_state ON items(state);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_module ON items(module);
CREATE INDEX idx_items_genesis ON items(genesis_stage);
CREATE INDEX idx_items_project ON items(project_id);

CREATE INDEX idx_connections_user ON item_connections(user_id);
CREATE INDEX idx_connections_source ON item_connections(source_id);
CREATE INDEX idx_connections_target ON item_connections(target_id);

CREATE INDEX idx_events_user ON atom_events(user_id);
CREATE INDEX idx_events_source ON atom_events(source_id);
CREATE INDEX idx_events_created ON atom_events(created_at);

-- 5.4 Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "items_isolation" ON items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "connections_isolation" ON item_connections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "events_isolation" ON atom_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5.5 Trigger: sync genesis_stage <-> state
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

CREATE TRIGGER trg_sync_genesis
  BEFORE UPDATE OF state ON items
  FOR EACH ROW EXECUTE FUNCTION sync_genesis_stage();

-- 5.6 Trigger: orphan downgrade
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

    IF v_floor <= 4 THEN
      UPDATE items
      SET state = 'validated', updated_at = NOW()
      WHERE id = OLD.source_id AND state = 'connected';
    END IF;
  END IF;

  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_orphan_check
  AFTER DELETE ON item_connections
  FOR EACH ROW EXECUTE FUNCTION check_orphan_downgrade();

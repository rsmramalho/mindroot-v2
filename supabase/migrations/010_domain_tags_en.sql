-- Migration 010: Domain tags PT → EN
-- Run manually in Supabase SQL Editor
-- Idempotent — safe to run multiple times

UPDATE items SET tags = array_replace(tags, '#domain:identidade', '#domain:identity'), updated_at = NOW() WHERE '#domain:identidade' = ANY(tags);
UPDATE items SET tags = array_replace(tags, '#domain:documentos', '#domain:documents'), updated_at = NOW() WHERE '#domain:documentos' = ANY(tags);
UPDATE items SET tags = array_replace(tags, '#domain:saude', '#domain:health'), updated_at = NOW() WHERE '#domain:saude' = ANY(tags);
UPDATE items SET tags = array_replace(tags, '#domain:financas', '#domain:finance'), updated_at = NOW() WHERE '#domain:financas' = ANY(tags);
UPDATE items SET tags = array_replace(tags, '#domain:arquivos', '#domain:storage'), updated_at = NOW() WHERE '#domain:arquivos' = ANY(tags);
UPDATE items SET tags = array_replace(tags, '#domain:memorias', '#domain:memories'), updated_at = NOW() WHERE '#domain:memorias' = ANY(tags);
UPDATE items SET tags = array_replace(tags, '#domain:tempo', '#domain:time'), updated_at = NOW() WHERE '#domain:tempo' = ANY(tags);
UPDATE items SET tags = array_replace(tags, '#domain:comunicacao', '#domain:communication'), updated_at = NOW() WHERE '#domain:comunicacao' = ANY(tags);
UPDATE items SET tags = array_replace(tags, '#domain:projetos', '#domain:projects'), updated_at = NOW() WHERE '#domain:projetos' = ANY(tags);

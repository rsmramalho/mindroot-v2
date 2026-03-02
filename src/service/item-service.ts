// service/item-service.ts — CRUD com mapper
// Hooks NÃO chamam Supabase direto. Sempre via service.

import { supabase } from './supabase';
import type { AtomItem, CreateItemPayload, UpdateItemPayload } from '@/types/item';

// ─── Row ↔ Item mapper ─────────────────────────────────────

function mapRowToItem(row: Record<string, unknown>): AtomItem {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    type: (row.type as AtomItem['type']) || 'task',
    module: (row.module as AtomItem['module']) || null,
    priority: (row.priority as AtomItem['priority']) || null,
    tags: (row.tags as string[]) || [],
    parent_id: (row.parent_id as string) || null,
    completed: (row.completed as boolean) || false,
    completed_at: (row.completed_at as string) || null,
    archived: (row.archived as boolean) || false,
    due_date: (row.due_date as string) || null,
    due_time: (row.due_time as string) || null,
    recurrence: (row.recurrence as string) || null,
    ritual_period: (row.ritual_period as AtomItem['ritual_period']) || null,
    emotion_before: (row.emotion_before as AtomItem['emotion_before']) || null,
    emotion_after: (row.emotion_after as AtomItem['emotion_after']) || null,
    needs_checkin: (row.needs_checkin as boolean) || false,
    is_chore: (row.is_chore as boolean) || false,
    energy_cost: (row.energy_cost as number) || null,
    description: (row.description as string) || null,
    context: (row.context as string) || null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

// ─── Service ────────────────────────────────────────────────

export const itemService = {
  async list(userId: string): Promise<AtomItem[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapRowToItem);
  },

  async getById(id: string): Promise<AtomItem> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapRowToItem(data);
  },

  async create(payload: CreateItemPayload): Promise<AtomItem> {
    const { data, error } = await supabase
      .from('items')
      .insert({
        ...payload,
        completed: false,
        archived: false,
        needs_checkin: payload.needs_checkin ?? false,
        is_chore: payload.is_chore ?? false,
        tags: payload.tags ?? [],
      })
      .select()
      .single();

    if (error) throw error;
    return mapRowToItem(data);
  },

  async update(id: string, payload: UpdateItemPayload): Promise<AtomItem> {
    // Integrity guard: reflections can't be completed
    if (payload.completed && payload.type === 'reflection') {
      throw new Error('Reflections cannot be completed');
    }

    const { data, error } = await supabase
      .from('items')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapRowToItem(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) throw error;
  },

  async complete(id: string): Promise<AtomItem> {
    return this.update(id, {
      completed: true,
      completed_at: new Date().toISOString(),
    });
  },

  async uncomplete(id: string): Promise<AtomItem> {
    return this.update(id, {
      completed: false,
      completed_at: null,
    });
  },
};

// hooks/useItemMutations.ts
// Mutations para CRUD de items
// Fase 1: create, update (edit/archive/module/priority), complete, uncomplete, delete

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '../service/item-service';
import { parseInput } from '../engine/parsing';
import type { AtomItem } from '../types/item';

export function useItemMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['items'] });

  // ━━━ Create ━━━
  const createMutation = useMutation({
    mutationFn: async (rawInput: string) => {
      const parsed = parseInput(rawInput);
      return itemService.create(parsed);
    },
    onSuccess: invalidate,
  });

  // ━━━ Update (edit, archive, set module, set priority, etc) ━━━
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AtomItem> }) => {
      return itemService.update(id, updates);
    },
    // Optimistic update
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData<AtomItem[]>(['items']);

      queryClient.setQueryData<AtomItem[]>(['items'], (old) =>
        old?.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['items'], context.previous);
      }
    },
    onSettled: invalidate,
  });

  // ━━━ Complete ━━━
  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      return itemService.complete(id);
    },
    // Optimistic
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData<AtomItem[]>(['items']);

      queryClient.setQueryData<AtomItem[]>(['items'], (old) =>
        old?.map((item) =>
          item.id === id ? { ...item, completed_at: new Date().toISOString() } : item
        )
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['items'], context.previous);
      }
    },
    onSettled: invalidate,
  });

  // ━━━ Uncomplete ━━━
  const uncompleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return itemService.uncomplete(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData<AtomItem[]>(['items']);

      queryClient.setQueryData<AtomItem[]>(['items'], (old) =>
        old?.map((item) =>
          item.id === id ? { ...item, completed_at: null } : item
        )
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['items'], context.previous);
      }
    },
    onSettled: invalidate,
  });

  // ━━━ Delete ━━━
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return itemService.delete(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData<AtomItem[]>(['items']);

      queryClient.setQueryData<AtomItem[]>(['items'], (old) =>
        old?.filter((item) => item.id !== id)
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['items'], context.previous);
      }
    },
    onSettled: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    completeMutation,
    uncompleteMutation,
    deleteMutation,
  };
}

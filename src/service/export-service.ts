// service/export-service.ts — Export items as downloadable files
// Formats: ATOM ENVELOPE (.txt), Obsidian (.md), JSON backup

import { supabase } from './supabase';
import type { AtomItem, ItemConnection } from '@/types/item';
import { STAGE_GEOMETRIES, STAGE_NAMES } from '@/components/atoms/tokens';

// ─── Download helper ─────────────────────────────────────

function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Naming convention (Genesis v5, Part 8.4) ────────────

function getExportFilename(item: AtomItem, ext: string): string {
  const prefix = item.module ? `mod-${item.module}` : 'system';
  const type = item.type ?? 'item';
  const desc = item.title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 40);
  const date = item.created_at?.slice(0, 10) ?? '';

  if (type === 'wrap' || type === 'session-log') {
    return `system_${type}_${date}.${ext}`;
  }
  return `${prefix}_${type}_${desc}.${ext}`;
}

// ─── ATOM ENVELOPE format ────────────────────────────────

function formatEnvelope(item: AtomItem, connections: ItemConnection[], allItems: AtomItem[]): string {
  const stage = item.genesis_stage ?? 1;
  const geo = STAGE_GEOMETRIES[stage] ?? '·';
  const stageName = STAGE_NAMES[stage] ?? 'Ponto';

  const connLines = connections.length > 0
    ? connections.map(c => {
        const targetTitle = allItems.find(i => i.id === c.target_id)?.title ?? c.target_id;
        return `   → ${c.relation}: ${targetTitle}`;
      }).join('\n')
    : '   (nenhuma)';

  const lines = [
    '══════════════════════════════════════',
    '         A T O M   E N V E L O P E   ',
    '══════════════════════════════════════',
    ` id:       ${item.id}`,
    ` type:     ${item.type ?? 'unknown'}`,
    ` module:   ${item.module ?? 'unknown'}`,
    ` state:    ${item.state ?? 'inbox'}`,
    ` status:   ${item.status ?? 'inbox'}`,
    ` stage:    ${stage} ${geo} ${stageName}`,
    ` tags:     ${(item.tags ?? []).join(', ') || '(nenhuma)'}`,
    ` source:   ${item.source ?? 'unknown'}`,
    ` created:  ${item.created_at?.slice(0, 10) ?? ''}`,
    ` updated:  ${item.updated_at?.slice(0, 10) ?? ''}`,
    '──────────────────────────────────────',
    ' connections:',
    connLines,
    '══════════════════════════════════════',
    '',
    `## ${item.title}`,
    '',
  ];

  if (item.notes) lines.push(item.notes, '');

  if (item.body && Object.keys(item.body).length > 0) {
    Object.entries(item.body).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        lines.push(`### ${key}`, JSON.stringify(value, null, 2), '');
      } else {
        lines.push(`**${key}:** ${value}`);
      }
    });
  }

  if (connections.length > 0) {
    lines.push('', '## Connections');
    connections.forEach(c => {
      const targetTitle = allItems.find(i => i.id === c.target_id)?.title ?? c.target_id;
      lines.push(`→ ${c.relation}: ${targetTitle}`);
    });
  }

  return lines.join('\n');
}

// ─── Obsidian .md format ─────────────────────────────────

function formatObsidian(item: AtomItem, connections: ItemConnection[], allItems: AtomItem[]): string {
  const connYaml = connections.length > 0
    ? connections.map(c => {
        const target = allItems.find(i => i.id === c.target_id);
        const slug = target ? target.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : c.target_id;
        return `  - target: ${slug}\n    relation: ${c.relation}`;
      }).join('\n')
    : '[]';

  const lines = [
    '---',
    `id: ${item.id}`,
    `title: "${item.title.replace(/"/g, '\\"')}"`,
    `type: ${item.type ?? 'unknown'}`,
    `module: ${item.module ?? 'unknown'}`,
    `state: ${item.state ?? 'inbox'}`,
    `status: ${item.status ?? 'inbox'}`,
    `genesis_stage: ${item.genesis_stage ?? 1}`,
    `tags: [${(item.tags ?? []).join(', ')}]`,
    `source: ${item.source ?? 'unknown'}`,
    `created_at: ${item.created_at ?? ''}`,
    `updated_at: ${item.updated_at ?? ''}`,
    `connections:`,
    connYaml,
    '---',
    '',
  ];

  if (item.notes) lines.push(item.notes, '');

  if (item.body && Object.keys(item.body).length > 0) {
    Object.entries(item.body).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        lines.push(`### ${key}`, '```json', JSON.stringify(value, null, 2), '```', '');
      } else {
        lines.push(`**${key}:** ${value}`);
      }
    });
  }

  if (connections.length > 0) {
    lines.push('', '## Connections');
    connections.forEach(c => {
      const target = allItems.find(i => i.id === c.target_id);
      const slug = target ? target.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : c.target_id;
      lines.push(`- ${c.relation}:: [[${slug}]]`);
    });
  }

  return lines.join('\n');
}

// ─── Public API ──────────────────────────────────────────

export const exportService = {
  async getConnectionsForItem(itemId: string): Promise<ItemConnection[]> {
    const { data } = await supabase
      .from('item_connections')
      .select('*')
      .or(`source_id.eq.${itemId},target_id.eq.${itemId}`);
    return (data ?? []) as ItemConnection[];
  },

  async exportAsEnvelope(item: AtomItem, allItems: AtomItem[]): Promise<void> {
    const connections = await this.getConnectionsForItem(item.id);
    const content = formatEnvelope(item, connections, allItems);
    downloadFile(content, getExportFilename(item, 'txt'));
  },

  async exportAsObsidian(item: AtomItem, allItems: AtomItem[]): Promise<void> {
    const connections = await this.getConnectionsForItem(item.id);
    const content = formatObsidian(item, connections, allItems);
    downloadFile(content, getExportFilename(item, 'md'), 'text/markdown');
  },

  async exportBatchObsidian(items: AtomItem[], allItems: AtomItem[]): Promise<void> {
    const files: string[] = [];
    for (const item of items) {
      const connections = await this.getConnectionsForItem(item.id);
      files.push(`<!-- FILE: ${getExportFilename(item, 'md')} -->\n\n${formatObsidian(item, connections, allItems)}`);
    }
    downloadFile(files.join('\n\n---\n\n'), 'mindroot-vault.md', 'text/markdown');
  },

  async exportAsJSON(items: AtomItem[]): Promise<void> {
    const content = JSON.stringify(items, null, 2);
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(content, `mindroot-backup-${date}.json`, 'application/json');
  },
};

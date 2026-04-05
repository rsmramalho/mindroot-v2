// pages/Graph.tsx — Force-directed graph visualization of connections
import { useRef, useEffect, useMemo, useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { useConnections } from '@/hooks/useConnections';
import { useNav } from '@/hooks/useNav';
import { MODULE_COLORS } from '@/components/atoms/tokens';
import { MODULES } from '@/types/item';
import type { AtomModule } from '@/types/item';
import * as d3 from 'd3';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  module: AtomModule | null;
  type: string | null;
  connectionCount: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  relation: string;
}

export function GraphPage() {
  const { items } = useItems();
  const { connections } = useConnections();
  const { selectItem } = useNav();
  const svgRef = useRef<SVGSVGElement>(null);
  const [moduleFilter, setModuleFilter] = useState<AtomModule | null>(null);

  // Build graph data
  const { nodes, links } = useMemo(() => {
    // Count connections per item
    const connCount = new Map<string, number>();
    connections.forEach((c) => {
      connCount.set(c.source_id, (connCount.get(c.source_id) ?? 0) + 1);
      connCount.set(c.target_id, (connCount.get(c.target_id) ?? 0) + 1);
    });

    // Only include items that have connections
    const connectedIds = new Set([...connections.map((c) => c.source_id), ...connections.map((c) => c.target_id)]);

    let filteredItems = items.filter((i) => connectedIds.has(i.id) && i.status !== 'archived');
    if (moduleFilter) {
      filteredItems = filteredItems.filter((i) => i.module === moduleFilter);
    }

    const nodes: GraphNode[] = filteredItems.map((i) => ({
      id: i.id,
      title: i.title.length > 20 ? i.title.slice(0, 20) + '...' : i.title,
      module: i.module,
      type: i.type,
      connectionCount: connCount.get(i.id) ?? 0,
    }));

    const nodeIds = new Set(nodes.map((n) => n.id));
    const links: GraphLink[] = connections
      .filter((c) => nodeIds.has(c.source_id) && nodeIds.has(c.target_id))
      .map((c) => ({
        source: c.source_id,
        target: c.target_id,
        relation: c.relation,
      }));

    return { nodes, links };
  }, [items, connections, moduleFilter]);

  // D3 force simulation
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.5);

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<any, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      )
      .on('click', (_event, d) => selectItem(d.id));

    // Node circles
    node.append('circle')
      .attr('r', (d) => 6 + d.connectionCount * 2)
      .attr('fill', (d) => {
        if (!d.module) return 'var(--color-mod-bridge)';
        const cssVar = MODULE_COLORS[d.module];
        return cssVar;
      })
      .attr('stroke', 'var(--color-bg)')
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .text((d) => d.title)
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('font-size', '10px')
      .attr('fill', 'var(--color-text-muted)');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [nodes, links, selectItem]);

  return (
    <div className="flex flex-col h-[calc(100dvh-56px)]">
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-medium tracking-tight">grafo</h1>
          <span className="text-xs text-text-muted">{nodes.length} nos, {links.length} conexoes</span>
        </div>
      </div>

      {/* Module filter */}
      <div className="flex gap-1.5 px-5 mb-2 overflow-x-auto">
        <button
          onClick={() => setModuleFilter(null)}
          className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap ${
            !moduleFilter ? 'bg-accent-bg text-accent font-medium' : 'bg-surface text-text-muted'
          }`}
        >
          todos
        </button>
        {MODULES.map((m) => (
          <button
            key={m.key}
            onClick={() => setModuleFilter(moduleFilter === m.key ? null : m.key)}
            className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap ${
              moduleFilter === m.key ? 'bg-accent-bg text-accent font-medium' : 'bg-surface text-text-muted'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Graph canvas */}
      {nodes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-text-muted">nenhuma conexao para visualizar</p>
        </div>
      ) : (
        <svg ref={svgRef} className="flex-1 w-full" />
      )}
    </div>
  );
}

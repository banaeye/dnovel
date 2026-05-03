import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import dagre from 'dagre';
import type { RawScene } from '../hooks/useYamlFs';

interface FlowPageProps {
  rawScenes: RawScene[];
  onSelectScene: (id: string) => void;
  initialSelectedId?: string | null;
}

interface FlowNode {
  id: string;
  scene: RawScene;
}

interface FlowEdge {
  from: string;
  to: string;
  type: 'next' | 'choice' | 'auto' | 'area' | 'engine' | 'child';
  label?: string;
}

const NODE_W = 160;
const NODE_H = 50;

const EDGE_COLOR: Record<FlowEdge['type'], string> = {
  next: '#5c8bcd',
  choice: '#4caf50',
  auto: '#ff9800',
  area: '#00bcd4',
  engine: '#ab47bc',
  child: '#555',
};

const EDGE_DASH: Record<FlowEdge['type'], string> = {
  next: 'none',
  choice: 'none',
  auto: 'none',
  area: '5,4',
  engine: '5,4',
  child: '3,3',
};

function flattenScenes(scenes: RawScene[], nodes: FlowNode[], edges: FlowEdge[], parentId?: string) {
  for (const s of scenes) {
    nodes.push({ id: s.id, scene: s });
    if (parentId) {
      edges.push({ from: parentId, to: s.id, type: 'child' });
    }
    if (s.next_scene) {
      edges.push({ from: s.id, to: s.next_scene, type: 'next' });
    }
    if (s.branches?.type === 'choice' && s.branches.choices) {
      for (const c of s.branches.choices) {
        if (c.next_scene) {
          edges.push({ from: s.id, to: c.next_scene, type: 'choice', label: c.label?.slice(0, 15) });
        }
      }
    }
    if (s.branches?.type === 'auto' && s.branches.choices) {
      for (const c of s.branches.choices) {
        if (c.next_scene) {
          edges.push({ from: s.id, to: c.next_scene, type: 'auto', label: 'auto' });
        }
      }
    }
    if (s.clickable_areas) {
      for (const a of s.clickable_areas) {
        if (a.next_scene) {
          edges.push({ from: s.id, to: a.next_scene, type: 'area', label: a.id?.slice(0, 12) });
        }
      }
    }
    if ((s as RawScene & { next_engine?: { id: string } }).next_engine) {
      const engineId = (s as RawScene & { next_engine?: { id: string } }).next_engine!.id;
      const virtualId = `ENGINE:${engineId}`;
      if (!nodes.find((n) => n.id === virtualId)) {
        nodes.push({ id: virtualId, scene: { id: virtualId } as RawScene });
      }
      edges.push({ from: s.id, to: virtualId, type: 'engine', label: engineId });
    }
    if (s.child_scenes?.length) {
      flattenScenes(s.child_scenes, nodes, edges, s.id);
    }
  }
}

function buildLayout(nodes: FlowNode[], edges: FlowEdge[]) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 30, ranksep: 80, marginx: 40, marginy: 40 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const n of nodes) g.setNode(n.id, { width: NODE_W, height: NODE_H });
  for (const e of edges) {
    if (nodes.find((n) => n.id === e.from) && nodes.find((n) => n.id === e.to)) {
      g.setEdge(e.from, e.to);
    }
  }
  dagre.layout(g);
  const positions = new Map<string, { x: number; y: number }>();
  for (const n of nodes) {
    const pos = g.node(n.id);
    if (pos) positions.set(n.id, { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 });
  }
  return positions;
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function EdgeLine({ edge, positions }: { edge: FlowEdge; positions: Map<string, { x: number; y: number }> }) {
  const from = positions.get(edge.from);
  const to = positions.get(edge.to);
  if (!from || !to) return null;

  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const color = EDGE_COLOR[edge.type];
  const dash = EDGE_DASH[edge.type];
  const markerId = `arrow-${edge.type}`;

  return (
    <g>
      <path
        d={cubicBezier(x1, y1, x2, y2)}
        fill="none"
        stroke={color}
        strokeWidth={edge.type === 'child' ? 1 : 1.5}
        strokeDasharray={dash}
        markerEnd={`url(#${markerId})`}
        opacity={0.8}
      />
      {edge.label && (
        <text
          x={mx}
          y={my - 4}
          fill={color}
          fontSize={9}
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
        >
          {edge.label}
        </text>
      )}
    </g>
  );
}

function SceneNode({
  node,
  pos,
  selected,
  onClick,
}: {
  node: FlowNode;
  pos: { x: number; y: number } | undefined;
  selected: boolean;
  onClick: (id: string) => void;
}) {
  if (!pos) return null;
  const s = node.scene;
  const isEngine = node.id.startsWith('ENGINE:');
  const isEnd = (s as RawScene & { game_end?: boolean }).game_end;
  const hasEngine = !!(s as RawScene & { next_engine?: unknown }).next_engine;

  let bg = '#1e293b';
  let border = '#334155';
  if (isEngine) { bg = '#1a1228'; border = '#7b1fa2'; }
  else if (isEnd) { bg = '#3b1a1a'; border = '#ef5350'; }
  else if (hasEngine) { bg = '#1e1a3b'; border = '#9c27b0'; }

  if (selected) border = '#ffcc00';

  return (
    <g
      transform={`translate(${pos.x},${pos.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(node.id)}
    >
      <rect
        width={NODE_W}
        height={NODE_H}
        rx={4}
        fill={bg}
        stroke={border}
        strokeWidth={selected ? 2 : 1}
      />
      <text
        x={NODE_W / 2}
        y={NODE_H / 2 + 4}
        fill="white"
        fontSize={11}
        textAnchor="middle"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {node.id.slice(0, 20)}
      </text>
    </g>
  );
}

export function FlowPage({ rawScenes, onSelectScene, initialSelectedId }: FlowPageProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const [zoom, setZoom] = useState(1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, edges, positions } = useMemo(() => {
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];
    flattenScenes(rawScenes, nodes, edges, undefined);
    const positions = buildLayout(nodes, edges);
    return { nodes, edges, positions };
  }, [rawScenes]);

  useEffect(() => {
    if (!initialSelectedId) return;
    const pos = positions.get(initialSelectedId);
    setSelected(initialSelectedId);
    if (!pos || !svgRef.current) return;
    const svgW = svgRef.current.clientWidth;
    const svgH = svgRef.current.clientHeight;
    setZoom(1);
    setPan({ x: svgW / 2 - (pos.x + NODE_W / 2), y: svgH / 2 - (pos.y + NODE_H / 2) });
  }, [initialSelectedId, positions]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNodeClick = useCallback((id: string) => {
    if (id.startsWith('ENGINE:')) return;
    setSelected(id);
    onSelectScene(id);
  }, [onSelectScene]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as SVGElement).closest('g[style*="pointer"]')) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const onMouseUp = () => { dragging.current = false; };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.15, Math.min(3.0, z * (e.deltaY < 0 ? 1.1 : 0.9))));
  };

  const edgeTypes: FlowEdge['type'][] = ['next', 'choice', 'auto', 'area', 'engine', 'child'];

  if (rawScenes.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555' }}>
        フォルダを開いてシーンデータを読み込んでください
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* コントロールバー */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '6px 12px',
        background: '#16213e', borderBottom: '1px solid #333', flexShrink: 0, flexWrap: 'wrap',
      }}>
        <button
          className="primary"
          onClick={() => { setPan({ x: 20, y: 20 }); setZoom(1); }}
          style={{ fontSize: 12 }}
        >
          リセット
        </button>
        <span style={{ fontSize: 11, color: '#666' }}>ズーム: {(zoom * 100).toFixed(0)}%</span>
        {selected && (
          <span style={{ fontSize: 11, color: '#ffcc00' }}>選択: {selected}</span>
        )}
        <div style={{ flex: 1 }} />
        {/* 凡例 */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {edgeTypes.map((t) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#aaa' }}>
              <svg width={20} height={8}>
                <line x1={0} y1={4} x2={20} y2={4} stroke={EDGE_COLOR[t]} strokeWidth={1.5}
                  strokeDasharray={EDGE_DASH[t]} />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* SVGキャンバス */}
      <svg
        ref={svgRef}
        style={{ flex: 1, background: '#0a0a14', cursor: dragging.current ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <defs>
          {edgeTypes.map((t) => (
            <marker
              key={t}
              id={`arrow-${t}`}
              markerWidth={8}
              markerHeight={8}
              refX={7}
              refY={3}
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill={EDGE_COLOR[t]} />
            </marker>
          ))}
        </defs>
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {edges.map((e, i) => (
            <EdgeLine key={i} edge={e} positions={positions} />
          ))}
          {nodes.map((n) => (
            <SceneNode
              key={n.id}
              node={n}
              pos={positions.get(n.id)}
              selected={n.id === selected}
              onClick={handleNodeClick}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

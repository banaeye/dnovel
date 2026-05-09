import { useRef, useState, useEffect, useCallback } from 'react';
import type { RawArea } from '../hooks/useYamlFs';

interface AreaCanvasProps {
  backgroundSrc: string | null;
  areas: RawArea[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAreaChange: (areas: RawArea[]) => void;
}

const CANVAS_W = 800;
const CANVAS_H = 600;
const COLOR_NORMAL = 'rgba(92, 107, 192, 0.45)';
const COLOR_SELECTED = 'rgba(255, 179, 0, 0.65)';
const BORDER_NORMAL = '#5c6bc0';
const BORDER_SELECTED = '#ffb300';
const HANDLE_SIZE = 12;

type DragState =
  | { mode: 'idle' }
  | { mode: 'drawing'; startX: number; startY: number; curX: number; curY: number }
  | { mode: 'moving'; id: string; offsetX: number; offsetY: number }
  | { mode: 'resizing'; id: string; startX: number; startY: number; origW: number; origH: number };

function handleRect(area: RawArea) {
  return {
    rx: area.x + area.width - HANDLE_SIZE / 2,
    ry: area.y + area.height - HANDLE_SIZE / 2,
  };
}

function hitTestResize(area: RawArea, cx: number, cy: number): boolean {
  const { rx, ry } = handleRect(area);
  return cx >= rx && cx <= rx + HANDLE_SIZE && cy >= ry && cy <= ry + HANDLE_SIZE;
}

function hitTestArea(area: RawArea, cx: number, cy: number): boolean {
  return cx >= area.x && cx <= area.x + area.width && cy >= area.y && cy <= area.y + area.height;
}

export function AreaCanvas({ backgroundSrc, areas, selectedId, onSelect, onAreaChange }: AreaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);
  const [drag, setDrag] = useState<DragState>({ mode: 'idle' });
  const [bgLoaded, setBgLoaded] = useState(false);
  const [cursor, setCursor] = useState<string>('default');

  useEffect(() => {
    bgRef.current = null;
    setBgLoaded(false);
    if (!backgroundSrc) return;
    const img = new Image();
    img.onload = () => { bgRef.current = img; setBgLoaded(true); };
    img.onerror = () => { bgRef.current = null; setBgLoaded(false); };
    img.src = backgroundSrc;
  }, [backgroundSrc]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    if (bgRef.current && bgLoaded) {
      ctx.drawImage(bgRef.current, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#444';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('背景画像なし', CANVAS_W / 2, CANVAS_H / 2);
    }

    for (const area of areas) {
      const isSelected = area.id === selectedId;
      ctx.fillStyle = isSelected ? COLOR_SELECTED : COLOR_NORMAL;
      ctx.strokeStyle = isSelected ? BORDER_SELECTED : BORDER_NORMAL;
      ctx.lineWidth = isSelected ? 2 : 1.5;
      ctx.fillRect(area.x, area.y, area.width, area.height);
      ctx.strokeRect(area.x, area.y, area.width, area.height);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(area.label || area.id, area.x + 4, area.y + 16);

      if (isSelected) {
        const { rx, ry } = handleRect(area);
        ctx.fillStyle = BORDER_SELECTED;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.fillRect(rx, ry, HANDLE_SIZE, HANDLE_SIZE);
        ctx.strokeRect(rx, ry, HANDLE_SIZE, HANDLE_SIZE);
      }
    }

    if (drag.mode === 'drawing') {
      const x = Math.min(drag.startX, drag.curX);
      const y = Math.min(drag.startY, drag.curY);
      const w = Math.abs(drag.curX - drag.startX);
      const h = Math.abs(drag.curY - drag.startY);
      ctx.fillStyle = 'rgba(100,200,100,0.35)';
      ctx.strokeStyle = '#66bb6a';
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${w}×${h}`, x + 3, y - 3);
    }
  }, [areas, selectedId, drag, bgLoaded]);

  useEffect(() => { draw(); }, [draw]);

  function clientToCanvas(e: React.MouseEvent<HTMLCanvasElement>): [number, number] {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return [
      Math.round((e.clientX - rect.left) * scaleX),
      Math.round((e.clientY - rect.top) * scaleY),
    ];
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (e.button !== 0) return;
    const [cx, cy] = clientToCanvas(e);

    const selected = areas.find((a) => a.id === selectedId);
    if (selected && hitTestResize(selected, cx, cy)) {
      setDrag({ mode: 'resizing', id: selected.id, startX: cx, startY: cy, origW: selected.width, origH: selected.height });
      setCursor('se-resize');
      return;
    }

    for (let i = areas.length - 1; i >= 0; i--) {
      if (hitTestArea(areas[i], cx, cy)) {
        onSelect(areas[i].id);
        setDrag({ mode: 'moving', id: areas[i].id, offsetX: cx - areas[i].x, offsetY: cy - areas[i].y });
        setCursor('grabbing');
        return;
      }
    }

    onSelect(null);
    setDrag({ mode: 'drawing', startX: cx, startY: cy, curX: cx, curY: cy });
    setCursor('crosshair');
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const [cx, cy] = clientToCanvas(e);

    if (drag.mode === 'idle') {
      const selected = areas.find((a) => a.id === selectedId);
      if (selected && hitTestResize(selected, cx, cy)) {
        setCursor('se-resize');
      } else if (areas.some((a) => hitTestArea(a, cx, cy))) {
        setCursor('grab');
      } else {
        setCursor('crosshair');
      }
      return;
    }

    if (drag.mode === 'drawing') {
      setDrag({ ...drag, curX: cx, curY: cy });
    } else if (drag.mode === 'moving') {
      onAreaChange(areas.map((a) =>
        a.id === drag.id ? { ...a, x: cx - drag.offsetX, y: cy - drag.offsetY } : a
      ));
    } else if (drag.mode === 'resizing') {
      const dx = cx - drag.startX;
      const dy = cy - drag.startY;
      onAreaChange(areas.map((a) =>
        a.id === drag.id
          ? { ...a, width: Math.max(10, drag.origW + dx), height: Math.max(10, drag.origH + dy) }
          : a
      ));
    }
  }

  function onMouseUp(_e: React.MouseEvent<HTMLCanvasElement>) {
    if (drag.mode === 'drawing') {
      const x = Math.min(drag.startX, drag.curX);
      const y = Math.min(drag.startY, drag.curY);
      const w = Math.abs(drag.curX - drag.startX);
      const h = Math.abs(drag.curY - drag.startY);
      if (w > 5 && h > 5) {
        const newId = `area_${Date.now()}`;
        onAreaChange([...areas, { id: newId, x, y, width: w, height: h, label: '', next_scene: null, condition: null }]);
        onSelect(newId);
      }
    }
    setDrag({ mode: 'idle' });
    setCursor('default');
  }

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ display: 'block', width: '100%', maxWidth: CANVAS_W, cursor }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
  );
}

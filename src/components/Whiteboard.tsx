import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eraser, MousePointer2, Pencil, Trash2, Type } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type WhiteboardHandle = {
  getImageDataUrl: () => string;
  isEmpty: () => boolean;
};

type Props = { storageKey?: string };

type TextElement = {
  id: string;
  x: number; y: number;
  width: number; height: number;
  value: string;
  fontSize: number;
  color: string;
};

type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
const HANDLES: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

type SelectionState =
  | { phase: 'drawing'; sx: number; sy: number; ex: number; ey: number }
  | { phase: 'placed'; x: number; y: number; w: number; h: number; dataUrl: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  { value: '#1e293b', label: 'Black' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#ef4444', label: 'Red' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
];
const SIZES = [
  { value: 2, label: 'S' },
  { value: 5, label: 'M' },
  { value: 11, label: 'L' },
];
const FONT_SIZES: Record<number, number> = { 2: 13, 5: 18, 11: 26 };

// ─── Handle position helpers ──────────────────────────────────────────────────

const HANDLE_PX = 8;
const H = HANDLE_PX / 2;

function handlePos(h: Handle, w: number, ht: number): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute', width: HANDLE_PX, height: HANDLE_PX,
    background: '#6366f1', border: '1px solid white', borderRadius: 2,
    zIndex: 31, cursor: h + '-resize',
  };
  const map: Record<Handle, React.CSSProperties> = {
    nw: { top: -H, left: -H },
    n:  { top: -H, left: w / 2 - H },
    ne: { top: -H, right: -H },
    e:  { top: ht / 2 - H, right: -H },
    se: { bottom: -H, right: -H },
    s:  { bottom: -H, left: w / 2 - H },
    sw: { bottom: -H, left: -H },
    w:  { top: ht / 2 - H, left: -H },
  };
  return { ...base, ...map[h] };
}

// ─── Component ────────────────────────────────────────────────────────────────

const Whiteboard = forwardRef<WhiteboardHandle, Props>(function Whiteboard({ storageKey }, ref) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const overlayRef    = useRef<HTMLCanvasElement>(null); // selection rect visualisation
  const containerRef  = useRef<HTMLDivElement>(null);

  const [tool, setTool]       = useState<'pen' | 'eraser' | 'text' | 'select'>('pen');
  const [color, setColor]     = useState(COLORS[0].value);
  const [size, setSize]       = useState(SIZES[1].value);
  const [hasContent, setHasContent] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [selection, setSelection] = useState<SelectionState | null>(null);

  const drawing      = useRef(false);
  const lastPos      = useRef<{ x: number; y: number } | null>(null);
  const selStart     = useRef<{ x: number; y: number } | null>(null);

  // ─── Init canvas + load storage ────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!storageKey) return;

    // migrate old single-key format
    const legacy = localStorage.getItem(storageKey);
    if (legacy && !localStorage.getItem(storageKey + '.pen')) {
      localStorage.setItem(storageKey + '.pen', legacy);
      localStorage.removeItem(storageKey);
    }

    const penData  = localStorage.getItem(storageKey + '.pen');
    const textData = localStorage.getItem(storageKey + '.text');

    if (penData) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0); setHasContent(true); };
      img.src = penData;
    }
    if (textData) {
      try {
        const els = JSON.parse(textData) as TextElement[];
        if (els.length) { setTextElements(els); setHasContent(true); }
      } catch { /* ignore */ }
    }
  }, [storageKey]);

  // ─── Persist text elements ─────────────────────────────────────────────────

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey + '.text', JSON.stringify(textElements));
  }, [storageKey, textElements]);

  // ─── Deactivate text element when clicking outside ─────────────────────────

  useEffect(() => {
    if (!activeTextId) return;
    const handler = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-text-el]')) return;
      deactivateText();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTextId]);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const savePen = () => {
    if (storageKey && canvasRef.current)
      localStorage.setItem(storageKey + '.pen', canvasRef.current.toDataURL('image/png'));
  };

  const cssToCanvas = (cssX: number, cssY: number) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: cssX * (c.width / r.width), y: cssY * (c.height / r.height) };
  };

  const eventToCss = (e: MouseEvent | React.MouseEvent, canvas: HTMLCanvasElement) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const deactivateText = () => {
    setActiveTextId(prev => {
      if (!prev) return null;
      setTextElements(els => {
        const el = els.find(t => t.id === prev);
        if (el && !el.value.trim()) return els.filter(t => t.id !== prev);
        return els;
      });
      return null;
    });
  };

  // ─── Pen/eraser drawing ───────────────────────────────────────────────────

  const penStart = (cssX: number, cssY: number) => {
    drawing.current = true;
    lastPos.current = cssToCanvas(cssX, cssY);
    const ctx = canvasRef.current!.getContext('2d')!;
    const s = tool === 'eraser' ? size * 4 : size;
    const { x, y } = lastPos.current;
    ctx.beginPath();
    ctx.arc(x, y, s / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.fill();
    if (tool !== 'eraser') setHasContent(true);
  };

  const penMove = (cssX: number, cssY: number) => {
    if (!drawing.current || !lastPos.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const s = tool === 'eraser' ? size * 4 : size;
    const next = cssToCanvas(cssX, cssY);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = next;
  };

  const penStop = () => {
    if (!drawing.current) return;
    drawing.current = false;
    lastPos.current = null;
    savePen();
  };

  // ─── Selection tool ───────────────────────────────────────────────────────

  const drawSelectionRect = (sx: number, sy: number, ex: number, ey: number) => {
    const oc = overlayRef.current;
    if (!oc) return;
    const ctx = oc.getContext('2d')!;
    ctx.clearRect(0, 0, oc.width, oc.height);
    const cp1 = cssToCanvas(sx, sy);
    const cp2 = cssToCanvas(ex, ey);
    const x = Math.min(cp1.x, cp2.x);
    const y = Math.min(cp1.y, cp2.y);
    const w = Math.abs(cp2.x - cp1.x);
    const h = Math.abs(cp2.y - cp1.y);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = 'rgba(99,102,241,0.08)';
    ctx.fillRect(x, y, w, h);
  };

  const clearOverlay = () => {
    const oc = overlayRef.current;
    if (oc) oc.getContext('2d')!.clearRect(0, 0, oc.width, oc.height);
  };

  const finalizeSelection = (endCss: { x: number; y: number }) => {
    const start = selStart.current!;
    selStart.current = null;
    clearOverlay();

    const minX = Math.min(start.x, endCss.x);
    const minY = Math.min(start.y, endCss.y);
    const w = Math.abs(endCss.x - start.x);
    const h = Math.abs(endCss.y - start.y);
    if (w < 5 || h < 5) { setSelection(null); return; }

    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width;
    const sy = c.height / r.height;
    const cx = Math.round(minX * sx), cy = Math.round(minY * sy);
    const cw = Math.round(w * sx),   ch = Math.round(h * sy);

    const off = document.createElement('canvas');
    off.width = cw; off.height = ch;
    off.getContext('2d')!.drawImage(c, cx, cy, cw, ch, 0, 0, cw, ch);

    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx, cy, cw, ch);

    setSelection({ phase: 'placed', x: minX, y: minY, w, h, dataUrl: off.toDataURL() });
  };

  const commitSelection = () => {
    if (!selection || selection.phase !== 'placed') { setSelection(null); return; }
    const { x, y, w, h, dataUrl } = selection;
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    const img = new Image();
    img.onload = () => {
      c.getContext('2d')!.drawImage(img, x * sx, y * sy, w * sx, h * sy);
      savePen();
    };
    img.src = dataUrl;
    setSelection(null);
  };

  const startSelectionMove = (e: React.MouseEvent) => {
    if (!selection || selection.phase !== 'placed') return;
    e.preventDefault(); e.stopPropagation();
    const initX = selection.x, initY = selection.y;
    const mx0 = e.clientX, my0 = e.clientY;
    const onMove = (ev: MouseEvent) => setSelection(s => s?.phase === 'placed'
      ? { ...s, x: initX + ev.clientX - mx0, y: initY + ev.clientY - my0 } : s);
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const startSelectionResize = (e: React.MouseEvent, corner: Handle) => {
    if (!selection || selection.phase !== 'placed') return;
    e.preventDefault(); e.stopPropagation();
    const init = { ...selection };
    const mx0 = e.clientX, my0 = e.clientY;
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setSelection(s => {
        if (!s || s.phase !== 'placed') return s;
        let { x, y, w, h } = { x: init.x, y: init.y, w: init.w, h: init.h };
        if (corner.includes('e')) w = Math.max(20, init.w + dx);
        if (corner.includes('s')) h = Math.max(20, init.h + dy);
        if (corner.includes('w')) { x = init.x + dx; w = Math.max(20, init.w - dx); }
        if (corner.includes('n')) { y = init.y + dy; h = Math.max(20, init.h - dy); }
        return { ...s, x, y, w, h };
      });
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // ─── Text elements ────────────────────────────────────────────────────────

  const createTextElement = (cssX: number, cssY: number) => {
    const id = Math.random().toString(36).slice(2);
    const el: TextElement = { id, x: cssX, y: cssY, width: 200, height: 80, value: '', fontSize: FONT_SIZES[size] ?? 18, color };
    setTextElements(prev => [...prev, el]);
    setActiveTextId(id);
  };

  const startTextDrag = (e: React.MouseEvent, id: string) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    e.preventDefault();
    const el = textElements.find(t => t.id === id)!;
    const ox = el.x, oy = el.y, mx0 = e.clientX, my0 = e.clientY;
    const onMove = (ev: MouseEvent) => setTextElements(prev => prev.map(t => t.id === id
      ? { ...t, x: ox + ev.clientX - mx0, y: oy + ev.clientY - my0 } : t));
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const startTextResize = (e: React.MouseEvent, id: string, handle: Handle) => {
    e.preventDefault(); e.stopPropagation();
    const el = textElements.find(t => t.id === id)!;
    const { x: ox, y: oy, width: ow, height: oh } = el;
    const mx0 = e.clientX, my0 = e.clientY;
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setTextElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        let { x, y, width, height } = t;
        if (handle.includes('e')) width  = Math.max(80, ow + dx);
        if (handle.includes('s')) height = Math.max(40, oh + dy);
        if (handle.includes('w')) { x = ox + dx; width  = Math.max(80, ow - dx); }
        if (handle.includes('n')) { y = oy + dy; height = Math.max(40, oh - dy); }
        return { ...t, x, y, width, height };
      }));
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const deleteTextEl = (id: string) => {
    setTextElements(prev => prev.filter(t => t.id !== id));
    if (activeTextId === id) setActiveTextId(null);
  };

  // ─── Canvas mouse handlers ────────────────────────────────────────────────

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const css = eventToCss(e, e.currentTarget);

    if (selection?.phase === 'placed') { commitSelection(); return; }

    if (tool === 'text') {
      deactivateText();
      createTextElement(css.x, css.y);
      return;
    }

    if (tool === 'select') {
      selStart.current = css;
      setSelection({ phase: 'drawing', sx: css.x, sy: css.y, ex: css.x, ey: css.y });
      return;
    }

    penStart(css.x, css.y);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const css = eventToCss(e, e.currentTarget);
    if (tool === 'select' && selection?.phase === 'drawing') {
      setSelection(s => s?.phase === 'drawing' ? { ...s, ex: css.x, ey: css.y } : s);
      drawSelectionRect(selection.sx, selection.sy, css.x, css.y);
    } else {
      penMove(css.x, css.y);
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'select' && selection?.phase === 'drawing') {
      const css = eventToCss(e, e.currentTarget);
      finalizeSelection(css);
    } else {
      penStop();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const t = e.touches[0];
    const r = e.currentTarget.getBoundingClientRect();
    penStart(t.clientX - r.left, t.clientY - r.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const t = e.touches[0];
    const r = e.currentTarget.getBoundingClientRect();
    penMove(t.clientX - r.left, t.clientY - r.top);
  };

  // ─── Clear ────────────────────────────────────────────────────────────────

  const handleClearConfirmed = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext('2d')!.fillStyle = '#ffffff';
    c.getContext('2d')!.fillRect(0, 0, c.width, c.height);
    setHasContent(false);
    setTextElements([]);
    setActiveTextId(null);
    setSelection(null);
    if (storageKey) {
      localStorage.removeItem(storageKey + '.pen');
      localStorage.removeItem(storageKey + '.text');
    }
    setConfirmClear(false);
  };

  // ─── Imperative handle ────────────────────────────────────────────────────

  useImperativeHandle(ref, () => ({
    isEmpty: () => !hasContent && textElements.every(t => !t.value.trim()),
    getImageDataUrl: () => {
      const c = canvasRef.current;
      if (!c) return '';
      if (!textElements.some(t => t.value.trim())) return c.toDataURL('image/png');

      const off = document.createElement('canvas');
      off.width = c.width; off.height = c.height;
      const ctx = off.getContext('2d')!;
      ctx.drawImage(c, 0, 0);

      const r = c.getBoundingClientRect();
      const sx = c.width / r.width, sy = c.height / r.height;

      textElements.forEach(el => {
        if (!el.value.trim()) return;
        const fs = el.fontSize * sy;
        ctx.font = `${fs}px sans-serif`;
        ctx.fillStyle = el.color;
        const pad = 8 * sx;
        const lineH = fs * 1.4;
        const maxW = el.width * sx - pad * 2;
        el.value.split('\n').forEach((line, i) => {
          ctx.fillText(line, el.x * sx + pad, el.y * sy + (i + 1) * lineH, maxW);
        });
      });
      return off.toDataURL('image/png');
    },
  }));

  // ─── Cursor ───────────────────────────────────────────────────────────────

  const canvasCursor =
    tool === 'eraser' ? 'cell' :
    tool === 'text'   ? 'text' :
    tool === 'select' ? 'crosshair' :
    'crosshair';

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="flex h-full flex-col">

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
        <div className="flex items-center overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
          {([
            { id: 'pen'    as const, icon: <Pencil size={13} />,         title: 'Pen' },
            { id: 'eraser' as const, icon: <Eraser size={13} />,         title: 'Eraser' },
            { id: 'text'   as const, icon: <Type size={13} />,           title: 'Text' },
            { id: 'select' as const, icon: <MousePointer2 size={13} />,  title: 'Select' },
          ] as const).map(({ id, icon, title }) => (
            <button key={id} onClick={() => { setTool(id); if (selection?.phase === 'placed') commitSelection(); }}
              title={title}
              className={`flex items-center px-2.5 py-1.5 transition ${tool === id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
              {icon}
            </button>
          ))}
        </div>

        {tool !== 'eraser' && tool !== 'select' && (
          <div className="flex items-center gap-1">
            {COLORS.map(c => (
              <button key={c.value} onClick={() => setColor(c.value)} title={c.label}
                className={`h-5 w-5 rounded-full border-2 transition hover:scale-110 ${color === c.value ? 'scale-110 border-slate-600 dark:border-slate-300' : 'border-transparent'}`}
                style={{ backgroundColor: c.value }} />
            ))}
          </div>
        )}

        {tool !== 'select' && (
          <div className="flex items-center gap-1">
            {SIZES.map(s => (
              <button key={s.value} onClick={() => setSize(s.value)}
                className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold transition ${size === s.value ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {tool === 'select' && (
          <span className="text-[11px] text-slate-400">Drag to select → move or scale with handles</span>
        )}

        <div className="flex-1" />

        <button onClick={() => setConfirmClear(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400">
          <Trash2 size={12} /> Clear
        </button>
      </div>

      {/* ── Canvas area ─────────────────────────────────────── */}
      <div className="relative min-h-0 flex-1 bg-white">

        {/* Pen canvas */}
        <canvas ref={canvasRef} width={1400} height={900}
          className="absolute inset-0 h-full w-full"
          style={{ cursor: canvasCursor, touchAction: 'none' }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={penStop}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={penStop}
        />

        {/* Overlay canvas (selection rect visualisation) */}
        <canvas ref={overlayRef} width={1400} height={900}
          className="pointer-events-none absolute inset-0 h-full w-full" />

        {/* Placeholder */}
        {!hasContent && textElements.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-slate-300 dark:text-slate-600">Draw your system design diagram here</p>
          </div>
        )}

        {/* ── Text elements ──────────────────────────────────── */}
        {textElements.map(el => {
          const isActive = el.id === activeTextId;
          return (
            <div key={el.id} data-text-el
              style={{ position: 'absolute', left: el.x, top: el.y, zIndex: 20, userSelect: 'none' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setActiveTextId(el.id);
                startTextDrag(e, el.id);
              }}
            >
              {/* Box */}
              <div style={{ position: 'relative', width: el.width, height: el.height, cursor: 'move' }}
                className={isActive ? 'border-2 border-dashed border-slate-400' : ''}
              >
                {isActive ? (
                  <textarea
                    autoFocus
                    value={el.value}
                    onChange={e => setTextElements(prev => prev.map(t => t.id === el.id ? { ...t, value: e.target.value } : t))}
                    onMouseDown={e => e.stopPropagation()}
                    onKeyDown={e => { if (e.key === 'Escape') deactivateText(); }}
                    placeholder="Type here…"
                    style={{ fontSize: el.fontSize, color: el.color, resize: 'none', cursor: 'text', lineHeight: 1.4 }}
                    className="h-full w-full border-0 bg-transparent p-1.5 outline-none placeholder:text-slate-300"
                  />
                ) : (
                  <div style={{ fontSize: el.fontSize, color: el.color, lineHeight: 1.4, whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '0.375rem' }}>
                    {el.value || <span className="text-slate-300 text-sm">Empty</span>}
                  </div>
                )}

                {/* Resize handles (only when active) */}
                {isActive && HANDLES.map(h => (
                  <div key={h} style={handlePos(h, el.width, el.height)}
                    onMouseDown={e => startTextResize(e, el.id, h)} />
                ))}
              </div>

              {/* Trash icon below box (only when active) */}
              {isActive && (
                <div style={{ position: 'absolute', top: el.height + 6, left: '50%', transform: 'translateX(-50%)' }}>
                  <button onMouseDown={e => { e.stopPropagation(); deleteTextEl(el.id); }}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Selection overlay ──────────────────────────────── */}
        {selection?.phase === 'placed' && (
          <div style={{ position: 'absolute', left: selection.x, top: selection.y, width: selection.w, height: selection.h, zIndex: 30, cursor: 'move' }}
            onMouseDown={startSelectionMove}
          >
            <img src={selection.dataUrl} draggable={false}
              className="h-full w-full"
              style={{ border: '2px dashed #6366f1', display: 'block' }} />

            {HANDLES.map(h => (
              <div key={h} style={handlePos(h, selection.w, selection.h)}
                onMouseDown={e => startSelectionResize(e, h)} />
            ))}

            {/* Commit hint */}
            <div style={{ position: 'absolute', top: selection.h + 6, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
              className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-white">
              Click outside to place · Esc to cancel
            </div>
          </div>
        )}
      </div>

      {/* ── Clear confirmation ──────────────────────────────── */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setConfirmClear(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={e => e.stopPropagation()}>
            <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100">Clear whiteboard?</h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">This will erase everything on the canvas. This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmClear(false)}
                className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button onClick={handleClearConfirmed}
                className="rounded-md bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-700">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Whiteboard;

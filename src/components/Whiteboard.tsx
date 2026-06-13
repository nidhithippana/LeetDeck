import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ArrowUpRight, Circle, Eraser, MousePointer2, Pencil, RotateCw, Square, Trash2, Type } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WhiteboardHandle = { getImageDataUrl: () => string; isEmpty: () => boolean };
type Props = { storageKey?: string };

type TextElement   = { id: string; type: 'text';   x: number; y: number; width: number; height: number; value: string; fontSize: number; color: string; rotation: number };
type RectElement   = { id: string; type: 'rect';   x: number; y: number; width: number; height: number; color: string; sw: number };
type CircleElement = { id: string; type: 'circle'; x: number; y: number; width: number; height: number; color: string; sw: number };
type ArrowElement  = { id: string; type: 'arrow';  x: number; y: number; x2: number; y2: number; color: string; sw: number };
type BoardElement  = TextElement | RectElement | CircleElement | ArrowElement;

type CornerHandle = 'nw' | 'ne' | 'sw' | 'se';

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
const SIZES = [{ value: 2, label: 'S' }, { value: 5, label: 'M' }, { value: 11, label: 'L' }];

const STROKE_W:   Record<number, number> = { 2: 1.5, 5: 3, 11: 5.5 };
const HANDLE_PX = 9;
const H2 = HANDLE_PX / 2;

// ─── Handle style helpers ─────────────────────────────────────────────────────


const endpointHandleStyle = (x: number, y: number): React.CSSProperties => ({
  position:'absolute', left: x - H2, top: y - H2, width:HANDLE_PX, height:HANDLE_PX,
  background:'#6366f1', border:'1.5px solid white', borderRadius:'50%', zIndex:32, cursor:'crosshair',
});

// ─── Canvas drawing helpers ───────────────────────────────��───────────────────

function drawArrowOnCanvas(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, sw: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head  = Math.max(14, sw * 5);
  ctx.lineWidth = sw;
  ctx.lineCap   = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - Math.PI/6), y2 - head * Math.sin(angle - Math.PI/6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle + Math.PI/6), y2 - head * Math.sin(angle + Math.PI/6));
  ctx.stroke();
}

// ─── Component ────────────────────────────────────────────────────────────────

type Tool = 'pen' | 'eraser' | 'text' | 'rect' | 'circle' | 'arrow' | 'select';

const Whiteboard = forwardRef<WhiteboardHandle, Props>(function Whiteboard({ storageKey }, ref) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const overlayRef   = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tool, setTool]           = useState<Tool>('pen');
  const [color, setColor]         = useState(COLORS[0].value);
  const [size, setSize]           = useState(SIZES[1].value);
  const [hasContent, setHasContent] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [elements, setElements]   = useState<BoardElement[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [selection, setSelection] = useState<SelectionState | null>(null);

  const drawing      = useRef(false);
  const lastPos      = useRef<{x:number;y:number}|null>(null);
  const shapeDragRef = useRef<{x:number;y:number}|null>(null);
  const selStart     = useRef<{x:number;y:number}|null>(null);

  // ─── Init + load ───────────────────────────────────────────────────────────

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height);
    if (!storageKey) return;

    const legacy = localStorage.getItem(storageKey);
    if (legacy && !localStorage.getItem(storageKey + '.pen')) {
      localStorage.setItem(storageKey + '.pen', legacy);
      localStorage.removeItem(storageKey);
    }

    const penData  = localStorage.getItem(storageKey + '.pen');
    const elsData  = localStorage.getItem(storageKey + '.elements')
                  ?? localStorage.getItem(storageKey + '.text');

    if (penData) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0); setHasContent(true); };
      img.src = penData;
    }
    if (elsData) {
      try {
        const raw = JSON.parse(elsData) as Array<BoardElement & { type?: string }>;
        const els = raw.map(e => ({ ...e, type: (e.type ?? 'text') as BoardElement['type'] })) as BoardElement[];
        if (els.length) { setElements(els); setHasContent(true); }
        localStorage.removeItem(storageKey + '.text');
      } catch { /* ignore */ }
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey + '.elements', JSON.stringify(elements));
  }, [storageKey, elements]);

  // Deactivate text on outside click (only for clicks truly outside the whiteboard)
  useEffect(() => {
    if (!activeTextId) return;
    const h = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      deactivateText();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTextId]);

  // Deselect shape on outside click (only for clicks truly outside the whiteboard)
  useEffect(() => {
    if (!selectedId) return;
    const h = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setSelectedId(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [selectedId]);

  // Delete key removes selected shape
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !activeTextId) {
        const tag = document.activeElement?.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT') return;
        setElements(prev => prev.filter(el => el.id !== selectedId));
        setSelectedId(null);
      }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [selectedId, activeTextId]);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const savePen = () => {
    if (storageKey && canvasRef.current)
      localStorage.setItem(storageKey + '.pen', canvasRef.current.toDataURL('image/png'));
  };

  const cssToCanvas = useCallback((cssX: number, cssY: number) => {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    return { x: cssX * (c.width / r.width), y: cssY * (c.height / r.height) };
  }, []);

  const newId = () => Math.random().toString(36).slice(2);
  const sw = () => STROKE_W[size] ?? 3;

  const clearOverlay = () => {
    const oc = overlayRef.current; if (!oc) return;
    oc.getContext('2d')!.clearRect(0, 0, oc.width, oc.height);
  };

  // ─── Text ──────────────────────────────────────────────────────────────────

  const deactivateText = () => {
    setActiveTextId(prev => {
      if (!prev) return null;
      setElements(els => {
        const el = els.find(t => t.id === prev && t.type === 'text') as TextElement | undefined;
        if (el && !el.value.trim()) return els.filter(t => t.id !== prev);
        return els;
      });
      return null;
    });
  };

  const fontSizeFromWidth = (w: number) => Math.max(8, Math.round(w * 0.09));

  const createText = (cssX: number, cssY: number) => {
    const id = newId();
    const widthForSize: Record<number, number> = { 2: 140, 5: 200, 11: 300 };
    const width = widthForSize[size] ?? 200;
    const fontSize = fontSizeFromWidth(width);
    setElements(prev => [...prev, { id, type:'text', x:cssX, y:cssY, width, height: Math.round(fontSize * 1.8), value:'', fontSize, color, rotation: 0 } as TextElement]);
    setActiveTextId(id);
  };

  const getBounds = () => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { W: r.width, H: r.height };
  };

  const startTextDrag = (e: React.MouseEvent, id: string) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    e.preventDefault();
    const el = elements.find(t => t.id === id) as TextElement;
    const { x: ox, y: oy } = el; const mx0 = e.clientX, my0 = e.clientY;
    const { W, H } = getBounds();
    const onMove = (ev: MouseEvent) => setElements(prev => prev.map(t => {
      if (t.id !== id) return t;
      const te = t as TextElement;
      return { ...t,
        x: Math.max(0, Math.min(W - te.width,  ox + ev.clientX - mx0)),
        y: Math.max(0, Math.min(H - te.height, oy + ev.clientY - my0)),
      };
    }));
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };

  const startWidthResize = (e: React.MouseEvent, id: string, side: 'w' | 'e') => {
    e.preventDefault(); e.stopPropagation();
    const el = elements.find(t => t.id === id) as TextElement;
    const { x: ox, width: ow } = el;
    const mx0 = e.clientX;
    const { W } = getBounds();
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0;
      setElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        const te = t as TextElement;
        let { x, width } = te;
        if (side === 'e') width = Math.max(60, Math.min(W - te.x, ow + dx));
        if (side === 'w') { x = Math.max(0, ox + dx); width = Math.max(60, (ox + ow) - x); }
        return { ...t, x, width, fontSize: fontSizeFromWidth(width) };
      }));
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };

  const startTextRotate = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    const el = elements.find(t => t.id === id) as TextElement;
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = rect.left + el.x + el.width / 2;
    const cy = rect.top  + el.y + el.height / 2;
    const onMove = (ev: MouseEvent) => {
      const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI + 90;
      setElements(prev => prev.map(t => t.id === id ? { ...t, rotation: Math.round(angle) } : t));
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };

  // ─── Shapes ────────────────────────────────────────────────────────────────

  const previewShape = (t: Tool, start: {x:number;y:number}, end: {x:number;y:number}) => {
    const oc = overlayRef.current; if (!oc) return;
    const ctx = oc.getContext('2d')!;
    ctx.clearRect(0, 0, oc.width, oc.height);
    const p1 = cssToCanvas(start.x, start.y);
    const p2 = cssToCanvas(end.x,   end.y);
    ctx.strokeStyle = color; ctx.lineWidth = sw() * (oc.width / (canvasRef.current!.getBoundingClientRect().width)); ctx.lineCap = 'round';

    if (t === 'rect') {
      const x=Math.min(p1.x,p2.x), y=Math.min(p1.y,p2.y), w=Math.abs(p2.x-p1.x), h=Math.abs(p2.y-p1.y);
      ctx.strokeRect(x, y, w, h);
    } else if (t === 'circle') {
      const cx=(p1.x+p2.x)/2, cy=(p1.y+p2.y)/2, rx=Math.abs(p2.x-p1.x)/2, ry=Math.abs(p2.y-p1.y)/2;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); ctx.stroke();
    } else if (t === 'arrow') {
      drawArrowOnCanvas(ctx, p1.x, p1.y, p2.x, p2.y, sw());
    }
  };

  const finalizeShape = (start: {x:number;y:number}, end: {x:number;y:number}) => {
    clearOverlay();
    const minW = 5, minH = 5;
    const id = newId();
    if (tool === 'arrow') {
      const dx = end.x - start.x, dy = end.y - start.y;
      if (Math.hypot(dx, dy) < 5) return;
      setElements(prev => [...prev, { id, type:'arrow', x:start.x, y:start.y, x2:end.x, y2:end.y, color, sw:sw() } as ArrowElement]);
    } else {
      const x = Math.min(start.x, end.x), y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x), h = Math.abs(end.y - start.y);
      if (w < minW || h < minH) return;
      const base = { id, x, y, width:w, height:h, color, sw:sw() };
      setElements(prev => [...prev, { ...base, type: tool } as RectElement | CircleElement]);
    }
    setHasContent(true);
  };

  const startShapeDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedId(id);
    const el = elements.find(t => t.id === id)!;
    const mx0 = e.clientX, my0 = e.clientY;
    const snap = { ...el };
    const { W, H } = getBounds();
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        if (t.type === 'arrow') {
          const a = snap as ArrowElement;
          const nx  = Math.max(0, Math.min(W, a.x  + dx)), ny  = Math.max(0, Math.min(H, a.y  + dy));
          const nx2 = Math.max(0, Math.min(W, a.x2 + dx)), ny2 = Math.max(0, Math.min(H, a.y2 + dy));
          return { ...t, x: nx, y: ny, x2: nx2, y2: ny2 };
        }
        const s = snap as RectElement;
        return { ...t,
          x: Math.max(0, Math.min(W - s.width,  s.x + dx)),
          y: Math.max(0, Math.min(H - s.height, s.y + dy)),
        };
      }));
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };

  const startCornerResize = (e: React.MouseEvent, id: string, corner: CornerHandle) => {
    e.preventDefault(); e.stopPropagation();
    const el = elements.find(t => t.id === id) as RectElement | CircleElement;
    const { x:ox, y:oy, width:ow, height:oh } = el;
    const mx0 = e.clientX, my0 = e.clientY;
    const { W, H } = getBounds();
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        let { x, y, width, height } = t as RectElement;
        if (corner.includes('e')) width  = Math.max(10, Math.min(W - ox,       ow + dx));
        if (corner.includes('s')) height = Math.max(10, Math.min(H - oy,       oh + dy));
        if (corner.includes('w')) { x = Math.max(0, ox + dx); width  = Math.max(10, (ox + ow) - x); }
        if (corner.includes('n')) { y = Math.max(0, oy + dy); height = Math.max(10, (oy + oh) - y); }
        return { ...t, x, y, width, height };
      }));
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };

  const startArrowEndpointDrag = (e: React.MouseEvent, id: string, endpoint: 'start' | 'end') => {
    e.preventDefault(); e.stopPropagation();
    const mx0 = e.clientX, my0 = e.clientY;
    const el = elements.find(t => t.id === id) as ArrowElement;
    const snap = { x: el.x, y: el.y, x2: el.x2, y2: el.y2 };
    const { W, H } = getBounds();
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        return endpoint === 'start'
          ? { ...t, x:  Math.max(0, Math.min(W, snap.x  + dx)), y:  Math.max(0, Math.min(H, snap.y  + dy)) }
          : { ...t, x2: Math.max(0, Math.min(W, snap.x2 + dx)), y2: Math.max(0, Math.min(H, snap.y2 + dy)) };
      }));
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (activeTextId === id) setActiveTextId(null);
  };

  // ─── Pen ───────────────────────────────────────────────────────────────────

  const penStart = (cssX: number, cssY: number) => {
    drawing.current = true; lastPos.current = cssToCanvas(cssX, cssY);
    const ctx = canvasRef.current!.getContext('2d')!;
    const s = tool === 'eraser' ? size * 4 : size;
    const { x, y } = lastPos.current;
    ctx.beginPath(); ctx.arc(x, y, s/2, 0, Math.PI*2);
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color; ctx.fill();
    if (tool !== 'eraser') setHasContent(true);
  };

  const penMove = (cssX: number, cssY: number) => {
    if (!drawing.current || !lastPos.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const s = tool === 'eraser' ? size * 4 : size;
    const next = cssToCanvas(cssX, cssY);
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(next.x, next.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = s; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    lastPos.current = next;
  };

  const penStop = () => {
    if (!drawing.current) return;
    drawing.current = false; lastPos.current = null; savePen();
  };

  // ─── Selection tool ────────────────────────────────────────────────────────

  const drawSelectionOverlay = (sx: number, sy: number, ex: number, ey: number) => {
    const oc = overlayRef.current; if (!oc) return;
    const ctx = oc.getContext('2d')!;
    ctx.clearRect(0, 0, oc.width, oc.height);
    const p1 = cssToCanvas(sx, sy), p2 = cssToCanvas(ex, ey);
    const x=Math.min(p1.x,p2.x), y=Math.min(p1.y,p2.y), w=Math.abs(p2.x-p1.x), h=Math.abs(p2.y-p1.y);
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2; ctx.setLineDash([6,4]);
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = 'rgba(99,102,241,0.07)'; ctx.fillRect(x, y, w, h);
  };

  const finalizeSelection = (endCss: {x:number;y:number}) => {
    const start = selStart.current!; selStart.current = null; clearOverlay();
    const minX=Math.min(start.x,endCss.x), minY=Math.min(start.y,endCss.y);
    const w=Math.abs(endCss.x-start.x), h=Math.abs(endCss.y-start.y);
    if (w<5||h<5) { setSelection(null); return; }
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    const sx=c.width/r.width, sy=c.height/r.height;
    const cx=Math.round(minX*sx), cy=Math.round(minY*sy), cw=Math.round(w*sx), ch=Math.round(h*sy);
    const off = document.createElement('canvas'); off.width=cw; off.height=ch;
    off.getContext('2d')!.drawImage(c, cx, cy, cw, ch, 0, 0, cw, ch);
    c.getContext('2d')!.fillStyle='#ffffff'; c.getContext('2d')!.fillRect(cx,cy,cw,ch);
    setSelection({ phase:'placed', x:minX, y:minY, w, h, dataUrl: off.toDataURL() });
  };

  const commitSelection = useCallback(() => {
    setSelection(prev => {
      if (!prev || prev.phase !== 'placed') return null;
      const { x, y, w, h, dataUrl } = prev;
      const c = canvasRef.current!; const r = c.getBoundingClientRect();
      const sx=c.width/r.width, sy=c.height/r.height;
      const img = new Image();
      img.onload = () => { c.getContext('2d')!.drawImage(img, x*sx, y*sy, w*sx, h*sy); savePen(); };
      img.src = dataUrl;
      return null;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSelectionMove = (e: React.MouseEvent) => {
    if (!selection || selection.phase !== 'placed') return;
    e.preventDefault(); e.stopPropagation();
    const { x:ix, y:iy } = selection; const mx0=e.clientX, my0=e.clientY;
    const { W, H } = getBounds();
    const onMove=(ev:MouseEvent)=>setSelection(s=>s?.phase==='placed'?{...s,
      x: Math.max(0, Math.min(W - s.w, ix+ev.clientX-mx0)),
      y: Math.max(0, Math.min(H - s.h, iy+ev.clientY-my0)),
    }:s);
    const onUp=()=>{document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);};
    document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
  };

  const startSelectionResize = (e: React.MouseEvent, corner: CornerHandle) => {
    if (!selection||selection.phase!=='placed') return;
    e.preventDefault(); e.stopPropagation();
    const init={...selection}; const mx0=e.clientX, my0=e.clientY;
    const { W, H } = getBounds();
    const onMove=(ev:MouseEvent)=>{
      const dx=ev.clientX-mx0, dy=ev.clientY-my0;
      setSelection(s=>{
        if(!s||s.phase!=='placed') return s;
        let{x,y,w,h}={x:init.x,y:init.y,w:init.w,h:init.h};
        if(corner.includes('e')) w=Math.max(20, Math.min(W - init.x, init.w+dx));
        if(corner.includes('s')) h=Math.max(20, Math.min(H - init.y, init.h+dy));
        if(corner.includes('w')){x=Math.max(0,init.x+dx);w=Math.max(20,(init.x+init.w)-x);}
        if(corner.includes('n')){y=Math.max(0,init.y+dy);h=Math.max(20,(init.y+init.h)-y);}
        return{...s,x,y,w,h};
      });
    };
    const onUp=()=>{document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);};
    document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
  };

  // ─── Canvas event dispatch ─────────────────────────────────────────────────

  const getRelativePos = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore clicks that already handled by shape/text element handlers
    if ((e.target as HTMLElement).closest('[data-shape-el],[data-text-el]')) return;
    const css = getRelativePos(e);
    if (selection?.phase === 'placed') { commitSelection(); return; }
    if (tool === 'text')   { deactivateText(); createText(css.x, css.y); return; }
    if (tool === 'select') { selStart.current = css; setSelection({ phase:'drawing', sx:css.x, sy:css.y, ex:css.x, ey:css.y }); return; }
    if (tool === 'rect' || tool === 'circle' || tool === 'arrow') { shapeDragRef.current = css; return; }
    penStart(css.x, css.y);
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const css = getRelativePos(e);
    if (tool === 'select' && selection?.phase === 'drawing') {
      setSelection(s => s?.phase==='drawing' ? {...s, ex:css.x, ey:css.y} : s);
      drawSelectionOverlay(selection.sx, selection.sy, css.x, css.y);
      return;
    }
    if (shapeDragRef.current && (tool==='rect'||tool==='circle'||tool==='arrow')) {
      previewShape(tool, shapeDragRef.current, css);
      return;
    }
    penMove(css.x, css.y);
  };

  const handleContainerMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const css = getRelativePos(e);
    if (tool === 'select' && selection?.phase === 'drawing') { finalizeSelection(css); return; }
    if (shapeDragRef.current && (tool==='rect'||tool==='circle'||tool==='arrow')) {
      finalizeShape(shapeDragRef.current, css);
      shapeDragRef.current = null;
      return;
    }
    penStop();
  };

  // ─── Clear ─────────────────────────────────────────────────────────────────

  const handleClearConfirmed = () => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d')!; ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,c.width,c.height);
    setHasContent(false); setElements([]); setActiveTextId(null); setSelectedId(null); setSelection(null);
    if (storageKey) { localStorage.removeItem(storageKey+'.pen'); localStorage.removeItem(storageKey+'.elements'); }
    setConfirmClear(false);
  };

  // ─── Export ────────────────────────────────────────────────────────────────

  useImperativeHandle(ref, () => ({
    isEmpty: () => !hasContent && elements.every(e => e.type !== 'text' || !(e as TextElement).value.trim()),
    getImageDataUrl: () => {
      const c = canvasRef.current; if (!c) return '';
      const off = document.createElement('canvas'); off.width=c.width; off.height=c.height;
      const ctx = off.getContext('2d')!; ctx.drawImage(c, 0, 0);
      const r = c.getBoundingClientRect(); const sx=c.width/r.width, sy=c.height/r.height;

      elements.forEach(el => {
        ctx.strokeStyle = el.color;
        if (el.type === 'rect') {
          ctx.lineWidth = el.sw; ctx.strokeRect(el.x*sx, el.y*sy, el.width*sx, el.height*sy);
        } else if (el.type === 'circle') {
          ctx.lineWidth = el.sw;
          ctx.beginPath();
          ctx.ellipse((el.x+el.width/2)*sx, (el.y+el.height/2)*sy, (el.width/2)*sx, (el.height/2)*sy, 0,0,Math.PI*2);
          ctx.stroke();
        } else if (el.type === 'arrow') {
          drawArrowOnCanvas(ctx, el.x*sx, el.y*sy, el.x2*sx, el.y2*sy, el.sw*sy);
        } else if (el.type === 'text') {
          const te = el as TextElement;
          if (!te.value.trim()) return;
          const fs = te.fontSize * sy;
          const cx = (te.x + te.width/2) * sx, cy = (te.y + te.height/2) * sy;
          const rot = (te.rotation ?? 0) * Math.PI / 180;
          ctx.save();
          ctx.translate(cx, cy); ctx.rotate(rot); ctx.translate(-cx, -cy);
          ctx.font=`${fs}px sans-serif`; ctx.fillStyle=te.color;
          const pad=8*sx, lineH=fs*1.4, maxW=(te.width-16)*sx;
          te.value.split('\n').forEach((line,i)=>ctx.fillText(line, te.x*sx+pad, te.y*sy+(i+1)*lineH, maxW));
          ctx.restore();
        }
      });
      return off.toDataURL('image/png');
    },
  }));

  // ─── Cursor ────────────────────────────────────────────────────────────────

  const canvasCursor = tool==='eraser' ? 'cell' : tool==='text' ? 'text' : tool==='select' ? 'crosshair' : (tool==='rect'||tool==='circle'||tool==='arrow') ? 'crosshair' : 'crosshair';

  const selectedEl = elements.find(e => e.id === selectedId);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="flex h-full flex-col">

      {/* ── Toolbar ─────────────────────────────────────���───────── */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
        {/* Tools */}
        <div className="flex items-center overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
          {([
            { id:'pen'    as Tool, icon:<Pencil size={13}/>,        title:'Pen' },
            { id:'eraser' as Tool, icon:<Eraser size={13}/>,        title:'Eraser' },
            { id:'text'   as Tool, icon:<Type size={13}/>,          title:'Text' },
            { id:'rect'   as Tool, icon:<Square size={13}/>,        title:'Rectangle' },
            { id:'circle' as Tool, icon:<Circle size={13}/>,        title:'Circle' },
            { id:'arrow'  as Tool, icon:<ArrowUpRight size={13}/>,  title:'Arrow' },
            { id:'select' as Tool, icon:<MousePointer2 size={13}/>, title:'Select & move' },
          ]).map(({ id, icon, title }) => (
            <button key={id} onClick={() => { setTool(id); if(selection?.phase==='placed') commitSelection(); }}
              title={title}
              className={`flex items-center px-2 py-1.5 transition ${tool===id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
              {icon}
            </button>
          ))}
        </div>

        {/* Color swatches */}
        {tool !== 'eraser' && tool !== 'select' && (
          <div className="flex items-center gap-1">
            {COLORS.map(c => (
              <button key={c.value} onClick={() => setColor(c.value)} title={c.label}
                className={`h-4.5 w-4.5 rounded-full border-2 transition hover:scale-110 ${color===c.value ? 'scale-110 border-slate-600 dark:border-slate-300' : 'border-transparent'}`}
                style={{ backgroundColor:c.value, width:18, height:18 }} />
            ))}
          </div>
        )}

        {/* Size */}
        {tool !== 'select' && (
          <div className="flex items-center gap-1">
            {SIZES.map(s => (
              <button key={s.value} onClick={() => setSize(s.value)}
                className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold transition ${size===s.value ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {tool === 'select' && <span className="text-[11px] text-slate-400">Click shape to select · drag handles to resize · Delete to remove</span>}

        <div className="flex-1" />
        <button onClick={() => setConfirmClear(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400">
          <Trash2 size={12} /> Clear
        </button>
      </div>

      {/* ── Canvas area ─────────────────────────────────────────── */}
      <div className="relative min-h-0 flex-1 bg-white"
        style={{ cursor: canvasCursor }}
        onMouseDown={handleContainerMouseDown}
        onMouseMove={handleContainerMouseMove}
        onMouseUp={handleContainerMouseUp}
        onMouseLeave={() => { penStop(); if(shapeDragRef.current){clearOverlay();shapeDragRef.current=null;} }}
      >

        {/* Pen canvas */}
        <canvas ref={canvasRef} width={1400} height={900}
          className="absolute inset-0 h-full w-full"
          style={{ touchAction:'none', pointerEvents:'none' }}
          onTouchStart={e=>{ e.preventDefault(); const t=e.touches[0]; const r=e.currentTarget.getBoundingClientRect(); penStart(t.clientX-r.left,t.clientY-r.top); }}
          onTouchMove={e=>{ e.preventDefault(); const t=e.touches[0]; const r=e.currentTarget.getBoundingClientRect(); penMove(t.clientX-r.left,t.clientY-r.top); }}
          onTouchEnd={penStop}
        />

        {/* Overlay canvas */}
        <canvas ref={overlayRef} width={1400} height={900}
          className="pointer-events-none absolute inset-0 h-full w-full" />

        {/* Placeholder */}
        {!hasContent && elements.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-slate-300 dark:text-slate-600">Draw your system design diagram here</p>
          </div>
        )}

        {/* ── Shape SVG layer ──────────────────────────────────── */}
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex:20, overflow:'visible', pointerEvents:'none' }}>
          <defs>
            {elements.filter(e => e.type==='arrow').map(e => {
              const a = e as ArrowElement;
              return (
                <marker key={`m-${a.id}`} id={`ah-${a.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={selectedId===a.id ? '#6366f1' : a.color} />
                </marker>
              );
            })}
          </defs>
          {elements.map(el => {
            const isSel = el.id === selectedId;
            const stroke = isSel ? '#6366f1' : el.color;
            const canInteract = tool === 'select';
            const pointerStyle: React.CSSProperties = { cursor: canInteract ? 'move' : 'default', pointerEvents: canInteract ? 'all' : 'none' };

            if (el.type === 'rect') {
              return <rect key={el.id} data-shape-el x={el.x} y={el.y} width={el.width} height={el.height}
                stroke={stroke} strokeWidth={el.sw} fill="none" strokeDasharray={isSel?'5 3':undefined}
                style={pointerStyle}
                onMouseDown={e => startShapeDrag(e, el.id)} />;
            }
            if (el.type === 'circle') {
              return <ellipse key={el.id} data-shape-el cx={el.x+el.width/2} cy={el.y+el.height/2} rx={el.width/2} ry={el.height/2}
                stroke={stroke} strokeWidth={el.sw} fill="none" strokeDasharray={isSel?'5 3':undefined}
                style={pointerStyle}
                onMouseDown={e => startShapeDrag(e, el.id)} />;
            }
            if (el.type === 'arrow') {
              return <line key={el.id} data-shape-el x1={el.x} y1={el.y} x2={el.x2} y2={el.y2}
                stroke={stroke} strokeWidth={el.sw} strokeLinecap="round"
                markerEnd={`url(#ah-${el.id})`}
                style={pointerStyle}
                onMouseDown={e => startShapeDrag(e, el.id)} />;
            }
            return null;
          })}
        </svg>

        {/* ── Shape resize handles (selected shape) ────────────── */}
        {selectedEl && selectedEl.type !== 'text' && tool === 'select' && (() => {
          if (selectedEl.type === 'arrow') {
            const a = selectedEl as ArrowElement;
            return (
              <>
                <div data-shape-el style={endpointHandleStyle(a.x, a.y)} onMouseDown={e => startArrowEndpointDrag(e, a.id,'start')} />
                <div data-shape-el style={endpointHandleStyle(a.x2, a.y2)} onMouseDown={e => startArrowEndpointDrag(e, a.id,'end')} />
                <div data-shape-el style={{ position:'absolute', bottom: -24, left:'50%', transform:'translateX(-50%)', zIndex:33 }}>
                  <button onMouseDown={e=>{e.stopPropagation();deleteElement(selectedEl.id);}}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:bg-rose-50 hover:text-rose-500 bg-white border border-slate-200 shadow-sm">
                    <Trash2 size={10}/> Delete
                  </button>
                </div>
              </>
            );
          }
          const s = selectedEl as RectElement | CircleElement;
          return (
            <>
              {(['nw','ne','sw','se'] as CornerHandle[]).map(corner => {
                const style: React.CSSProperties = {
                  position:'absolute', width:HANDLE_PX, height:HANDLE_PX,
                  background:'#6366f1', border:'1.5px solid white', borderRadius:2, zIndex:32, cursor:corner+'-resize',
                  left: corner.includes('w') ? s.x - H2 : s.x + s.width - H2,
                  top:  corner.includes('n') ? s.y - H2 : s.y + s.height - H2,
                };
                return <div key={corner} data-shape-el style={style} onMouseDown={e => startCornerResize(e, s.id, corner)} />;
              })}
              <div data-shape-el style={{ position:'absolute', left: s.x + s.width/2, top: s.y + s.height + 6, transform:'translateX(-50%)', zIndex:33 }}>
                <button onMouseDown={e=>{e.stopPropagation();deleteElement(s.id);}}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:bg-rose-50 hover:text-rose-500 bg-white border border-slate-200 shadow-sm">
                  <Trash2 size={10}/> Delete
                </button>
              </div>
            </>
          );
        })()}

        {/* ── Text elements ────────────────────────────────────── */}
        {elements.filter(e => e.type === 'text').map(el => {
          const te = el as TextElement;
          const isActive = te.id === activeTextId;
          const rot = te.rotation ?? 0;
          return (
            <div key={te.id} data-text-el
              style={{
                position: 'absolute', left: te.x, top: te.y,
                width: te.width,
                zIndex: 25, userSelect: 'none', overflow: 'visible',
                transform: `rotate(${rot}deg)`,
                transformOrigin: 'center center',
              }}
              onMouseDown={e => { e.stopPropagation(); setActiveTextId(te.id); startTextDrag(e, te.id); }}
            >
              {/* Rotation handle */}
              {isActive && (
                <div
                  style={{ position:'absolute', top:-36, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', cursor:'grab', zIndex:35 }}
                  onMouseDown={e => startTextRotate(e, te.id)}
                >
                  <div style={{ width:1, height:22, background:'#6366f1', opacity:0.5 }} />
                  <div style={{ width:14, height:14, borderRadius:'50%', background:'#6366f1', border:'2px solid white', boxShadow:'0 0 0 1.5px #6366f1', display:'flex', alignItems:'center', justifyContent:'center', marginTop:-1 }}>
                    <RotateCw size={8} color="white" />
                  </div>
                </div>
              )}

              {/* Text box — height auto-fits content */}
              <div style={{ position:'relative', cursor:'move' }}
                className={isActive ? 'border-2 border-dashed border-indigo-400' : ''}
              >
                {isActive ? (
                  <textarea autoFocus value={te.value}
                    ref={el => {
                      if (!el) return;
                      el.style.height = 'auto';
                      const h = el.scrollHeight;
                      el.style.height = h + 'px';
                      if (te.height !== h) setElements(prev => prev.map(t => t.id===te.id ? {...t, height:h} : t));
                    }}
                    onChange={e => {
                      e.target.style.height = 'auto';
                      const h = e.target.scrollHeight;
                      e.target.style.height = h + 'px';
                      setElements(prev => prev.map(t => t.id===te.id ? {...t, value:e.target.value, height:h} : t));
                    }}
                    onMouseDown={e => e.stopPropagation()}
                    onKeyDown={e => { if(e.key==='Escape') deactivateText(); }}
                    placeholder="Type here…"
                    style={{ fontSize:te.fontSize, color:te.color, resize:'none', cursor:'text', lineHeight:1.4, width:'100%', display:'block', overflow:'hidden' }}
                    className="border-0 bg-transparent p-2 outline-none placeholder:text-slate-300"
                  />
                ) : (
                  <div style={{ fontSize:te.fontSize, color:te.color, lineHeight:1.4, whiteSpace:'pre-wrap', wordBreak:'break-word', padding:'0.5rem', minHeight: te.fontSize * 1.8 }}>
                    {te.value || <span style={{ opacity:0.3 }}>Text</span>}
                  </div>
                )}

                {/* Left / right width resize handles */}
                {isActive && (
                  <>
                    <div
                      style={{ position:'absolute', left:-5, top:0, bottom:0, width:10, cursor:'ew-resize', zIndex:33, display:'flex', alignItems:'center', justifyContent:'center' }}
                      onMouseDown={e => startWidthResize(e, te.id, 'w')}
                    >
                      <div style={{ width:3, height:20, background:'#6366f1', borderRadius:2, opacity:0.7 }} />
                    </div>
                    <div
                      style={{ position:'absolute', right:-5, top:0, bottom:0, width:10, cursor:'ew-resize', zIndex:33, display:'flex', alignItems:'center', justifyContent:'center' }}
                      onMouseDown={e => startWidthResize(e, te.id, 'e')}
                    >
                      <div style={{ width:3, height:20, background:'#6366f1', borderRadius:2, opacity:0.7 }} />
                    </div>
                  </>
                )}
              </div>

              {/* Delete button */}
              {isActive && (
                <div style={{ position:'absolute', top:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)', whiteSpace:'nowrap' }}>
                  <button onMouseDown={e => { e.stopPropagation(); deleteElement(te.id); }}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:bg-rose-50 hover:text-rose-500 bg-white border border-slate-200 shadow-sm">
                    <Trash2 size={10}/> Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Selection overlay ────────────────────────────────── */}
        {selection?.phase === 'placed' && (
          <div style={{ position:'absolute', left:selection.x, top:selection.y, width:selection.w, height:selection.h, zIndex:30, cursor:'move' }}
            onMouseDown={startSelectionMove}>
            <img src={selection.dataUrl} draggable={false} className="h-full w-full" style={{ border:'2px dashed #6366f1', display:'block' }} />
            {(['nw','ne','sw','se'] as CornerHandle[]).map(corner => {
              const style: React.CSSProperties = {
                position:'absolute', width:HANDLE_PX, height:HANDLE_PX,
                background:'#6366f1', border:'1.5px solid white', borderRadius:2, zIndex:32, cursor:corner+'-resize',
                left: corner.includes('w') ? -H2 : selection.w - H2,
                top:  corner.includes('n') ? -H2 : selection.h - H2,
              };
              return <div key={corner} style={style} onMouseDown={e => startSelectionResize(e, corner)} />;
            })}
            <div style={{ position:'absolute', top:selection.h+6, left:'50%', transform:'translateX(-50%)', whiteSpace:'nowrap', zIndex:33 }}
              className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-white">
              Click outside to place
            </div>
          </div>
        )}
      </div>

      {/* ── Clear confirmation ─────────────────────────────────── */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmClear(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900" onClick={e => e.stopPropagation()}>
            <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100">Clear whiteboard?</h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">This will erase everything on the canvas. This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmClear(false)} className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
              <button onClick={handleClearConfirmed} className="rounded-md bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-700">Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Whiteboard;

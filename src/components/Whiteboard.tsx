import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ArrowUpRight, Circle, Eraser, MousePointer2, Pencil, Square, Trash2, Type } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WhiteboardHandle = { getImageDataUrl: () => string; isEmpty: () => boolean };
type Props = { storageKey?: string };

type TextElement   = { id: string; type: 'text';   x: number; y: number; width: number; height: number; value: string; fontSize: number; color: string };
type RectElement   = { id: string; type: 'rect';   x: number; y: number; width: number; height: number; color: string; sw: number };
type CircleElement = { id: string; type: 'circle'; x: number; y: number; width: number; height: number; color: string; sw: number };
type ArrowElement  = { id: string; type: 'arrow';  x: number; y: number; x2: number; y2: number; color: string; sw: number };
type BoardElement  = TextElement | RectElement | CircleElement | ArrowElement;

type CornerHandle = 'nw' | 'ne' | 'sw' | 'se';
type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
const TEXT_HANDLES: ResizeHandle[] = ['nw','n','ne','e','se','s','sw','w'];

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
const FONT_SIZES: Record<number, number> = { 2: 13, 5: 18, 11: 26 };
const STROKE_W:   Record<number, number> = { 2: 1.5, 5: 3, 11: 5.5 };
const HANDLE_PX = 9;
const H2 = HANDLE_PX / 2;

// ─── Handle style helpers ─────────────────────────────────────────────────────

function textHandleStyle(h: ResizeHandle, w: number, ht: number): React.CSSProperties {
  const base: React.CSSProperties = { position:'absolute', width:HANDLE_PX, height:HANDLE_PX, background:'#6366f1', border:'1.5px solid white', borderRadius:2, zIndex:32, cursor: h+'-resize' };
  const m: Record<ResizeHandle, React.CSSProperties> = {
    nw:{ top:-H2, left:-H2 }, n:{ top:-H2, left:w/2-H2 }, ne:{ top:-H2, right:-H2 },
    e:{ top:ht/2-H2, right:-H2 }, se:{ bottom:-H2, right:-H2 }, s:{ bottom:-H2, left:w/2-H2 },
    sw:{ bottom:-H2, left:-H2 }, w:{ top:ht/2-H2, left:-H2 },
  };
  return { ...base, ...m[h] };
}


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

  // Deactivate text on outside click
  useEffect(() => {
    if (!activeTextId) return;
    const h = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-text-el]')) return;
      deactivateText();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTextId]);

  // Deselect shape on outside click (when select tool active)
  useEffect(() => {
    if (!selectedId) return;
    const h = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-shape-el],[data-text-el]')) return;
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

  const createText = (cssX: number, cssY: number) => {
    const id = newId();
    setElements(prev => [...prev, { id, type:'text', x:cssX, y:cssY, width:200, height:80, value:'', fontSize: FONT_SIZES[size]??18, color } as TextElement]);
    setActiveTextId(id);
  };

  const startTextDrag = (e: React.MouseEvent, id: string) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    e.preventDefault();
    const el = elements.find(t => t.id === id)!;
    const { x: ox, y: oy } = el; const mx0 = e.clientX, my0 = e.clientY;
    const onMove = (ev: MouseEvent) => setElements(prev => prev.map(t => t.id === id ? { ...t, x: ox + ev.clientX - mx0, y: oy + ev.clientY - my0 } : t));
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };

  const startTextResize = (e: React.MouseEvent, id: string, handle: ResizeHandle) => {
    e.preventDefault(); e.stopPropagation();
    const el = elements.find(t => t.id === id) as TextElement;
    const { x:ox, y:oy, width:ow, height:oh } = el;
    const mx0 = e.clientX, my0 = e.clientY;
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        let { x, y, width, height } = t as TextElement;
        if (handle.includes('e')) width  = Math.max(80, ow + dx);
        if (handle.includes('s')) height = Math.max(40, oh + dy);
        if (handle.includes('w')) { x = ox + dx; width  = Math.max(80, ow - dx); }
        if (handle.includes('n')) { y = oy + dy; height = Math.max(40, oh - dy); }
        return { ...t, x, y, width, height };
      }));
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
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        if (t.type === 'arrow') {
          const a = snap as ArrowElement;
          return { ...t, x: a.x + dx, y: a.y + dy, x2: a.x2 + dx, y2: a.y2 + dy };
        }
        return { ...t, x: (snap as RectElement).x + dx, y: (snap as RectElement).y + dy };
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
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        let { x, y, width, height } = t as RectElement;
        if (corner.includes('e')) width  = Math.max(10, ow + dx);
        if (corner.includes('s')) height = Math.max(10, oh + dy);
        if (corner.includes('w')) { x = ox + dx; width  = Math.max(10, ow - dx); }
        if (corner.includes('n')) { y = oy + dy; height = Math.max(10, oh - dy); }
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
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - mx0, dy = ev.clientY - my0;
      setElements(prev => prev.map(t => {
        if (t.id !== id) return t;
        return endpoint === 'start'
          ? { ...t, x: snap.x + dx, y: snap.y + dy }
          : { ...t, x2: snap.x2 + dx, y2: snap.y2 + dy };
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
    const onMove=(ev:MouseEvent)=>setSelection(s=>s?.phase==='placed'?{...s,x:ix+ev.clientX-mx0,y:iy+ev.clientY-my0}:s);
    const onUp=()=>{document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);};
    document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
  };

  const startSelectionResize = (e: React.MouseEvent, corner: CornerHandle) => {
    if (!selection||selection.phase!=='placed') return;
    e.preventDefault(); e.stopPropagation();
    const init={...selection}; const mx0=e.clientX, my0=e.clientY;
    const onMove=(ev:MouseEvent)=>{
      const dx=ev.clientX-mx0, dy=ev.clientY-my0;
      setSelection(s=>{
        if(!s||s.phase!=='placed') return s;
        let{x,y,w,h}={x:init.x,y:init.y,w:init.w,h:init.h};
        if(corner.includes('e')) w=Math.max(20,init.w+dx);
        if(corner.includes('s')) h=Math.max(20,init.h+dy);
        if(corner.includes('w')){x=init.x+dx;w=Math.max(20,init.w-dx);}
        if(corner.includes('n')){y=init.y+dy;h=Math.max(20,init.h-dy);}
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
          ctx.font=`${fs}px sans-serif`; ctx.fillStyle=te.color;
          const pad=8*sx, lineH=fs*1.4, maxW=(te.width-16)*sx;
          te.value.split('\n').forEach((line,i)=>ctx.fillText(line, te.x*sx+pad, te.y*sy+(i+1)*lineH, maxW));
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
          return (
            <div key={te.id} data-text-el
              style={{ position:'absolute', left:te.x, top:te.y, zIndex:25, userSelect:'none' }}
              onMouseDown={e => { e.stopPropagation(); setActiveTextId(te.id); startTextDrag(e, te.id); }}>
              <div style={{ position:'relative', width:te.width, height:te.height, cursor:'move' }}
                className={isActive ? 'border-2 border-dashed border-slate-400' : ''}>
                {isActive ? (
                  <textarea autoFocus value={te.value}
                    onChange={e => setElements(prev => prev.map(t => t.id===te.id ? {...t, value:e.target.value} : t))}
                    onMouseDown={e => e.stopPropagation()}
                    onKeyDown={e => { if(e.key==='Escape') deactivateText(); }}
                    placeholder="Type here…"
                    style={{ fontSize:te.fontSize, color:te.color, resize:'none', cursor:'text', lineHeight:1.4 }}
                    className="h-full w-full border-0 bg-transparent p-1.5 outline-none placeholder:text-slate-300" />
                ) : (
                  <div style={{ fontSize:te.fontSize, color:te.color, lineHeight:1.4, whiteSpace:'pre-wrap', wordBreak:'break-word', padding:'0.375rem' }}>
                    {te.value || <span className="text-slate-300 text-sm">Empty</span>}
                  </div>
                )}
                {isActive && TEXT_HANDLES.map(h => (
                  <div key={h} style={textHandleStyle(h, te.width, te.height)} onMouseDown={e => startTextResize(e, te.id, h)} />
                ))}
              </div>
              {isActive && (
                <div style={{ position:'absolute', top:te.height+6, left:'50%', transform:'translateX(-50%)' }}>
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

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Check, Eraser, Pencil, Trash2, Type, X } from 'lucide-react';

export type WhiteboardHandle = {
  getImageDataUrl: () => string;
  isEmpty: () => boolean;
};

type Props = {
  storageKey?: string;
};

type TextBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
};

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

const FONT_SIZE: Record<number, number> = { 2: 13, 5: 18, 11: 26 };
const HEADER_H = 28;

const Whiteboard = forwardRef<WhiteboardHandle, Props>(function Whiteboard({ storageKey }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const resizeDivRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mx: number; my: number; bx: number; by: number } | null>(null);

  const [tool, setTool] = useState<'pen' | 'eraser' | 'text'>('pen');
  const [color, setColor] = useState(COLORS[0].value);
  const [size, setSize] = useState(SIZES[1].value);
  const [hasContent, setHasContent] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [textBox, setTextBox] = useState<TextBox | null>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const img = new Image();
        img.onload = () => { ctx.drawImage(img, 0, 0); setHasContent(true); };
        img.src = saved;
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (textBox) textAreaRef.current?.focus();
  }, [!!textBox]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveToStorage = () => {
    if (storageKey && canvasRef.current) {
      localStorage.setItem(storageKey, canvasRef.current.toDataURL('image/png'));
    }
  };

  const getCSSAndCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      cssX: e.clientX - rect.left,
      cssY: e.clientY - rect.top,
      canvasX: (e.clientX - rect.left) * (canvas.width / rect.width),
      canvasY: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const getTouchCanvasPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    return {
      x: (t.clientX - rect.left) * (canvas.width / rect.width),
      y: (t.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const commitTextBox = () => {
    const tb = textBox;
    if (!tb) return;
    setTextBox(null);
    if (!tb.value.trim()) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const ctx = canvas.getContext('2d')!;
    const fs = (FONT_SIZE[size] ?? 18) * scaleY;
    ctx.font = `${fs}px sans-serif`;
    ctx.fillStyle = color;

    const pad = 6 * scaleX;
    const canvasX = tb.x * scaleX + pad;
    const canvasY = (tb.y + HEADER_H) * scaleY;
    const lineH = fs * 1.4;
    const maxW = tb.width * scaleX - pad * 2;

    tb.value.split('\n').forEach((line, i) => {
      ctx.fillText(line, canvasX, canvasY + (i + 1) * lineH, maxW);
    });

    setHasContent(true);
    saveToStorage();
  };

  const handleDragBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    const tb = textBox!;
    dragStartRef.current = { mx: e.clientX, my: e.clientY, bx: tb.x, by: tb.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragStartRef.current) return;
      setTextBox(prev => prev ? {
        ...prev,
        x: dragStartRef.current!.bx + ev.clientX - dragStartRef.current!.mx,
        y: dragStartRef.current!.by + ev.clientY - dragStartRef.current!.my,
      } : null);
    };
    const onUp = () => {
      dragStartRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const captureResizeSize = () => {
    const el = resizeDivRef.current;
    if (!el) return;
    setTextBox(prev => prev ? { ...prev, width: el.offsetWidth, height: el.offsetHeight } : null);
  };

  const startDrawing = (pos: { x: number; y: number }) => {
    drawing.current = true;
    lastPos.current = pos;
    const ctx = canvasRef.current!.getContext('2d')!;
    const strokeSize = tool === 'eraser' ? size * 4 : size;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, strokeSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.fill();
    setHasContent(true);
  };

  const continueDraw = (pos: { x: number; y: number }) => {
    if (!drawing.current || !lastPos.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const strokeSize = tool === 'eraser' ? size * 4 : size;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = strokeSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDrawing = () => {
    if (!drawing.current) return;
    drawing.current = false;
    lastPos.current = null;
    saveToStorage();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'text') {
      if (textBox) commitTextBox();
      const pos = getCSSAndCanvasPos(e);
      setTextBox({ x: pos.cssX, y: pos.cssY, width: 220, height: 90, value: '' });
    } else {
      const pos = getCSSAndCanvasPos(e);
      startDrawing({ x: pos.canvasX, y: pos.canvasY });
    }
  };

  const handleClearConfirmed = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
    setTextBox(null);
    if (storageKey) localStorage.removeItem(storageKey);
    setConfirmClear(false);
  };

  useImperativeHandle(ref, () => ({
    getImageDataUrl: () => canvasRef.current?.toDataURL('image/png') ?? '',
    isEmpty: () => !hasContent,
  }));

  const canvasCursor = tool === 'eraser' ? 'cell' : tool === 'text' ? 'text' : 'crosshair';

  return (
    <div ref={containerRef} className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
        <div className="flex items-center overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
          {[
            { id: 'pen' as const, icon: <Pencil size={13} />, title: 'Pen' },
            { id: 'eraser' as const, icon: <Eraser size={13} />, title: 'Eraser' },
            { id: 'text' as const, icon: <Type size={13} />, title: 'Text' },
          ].map(({ id, icon, title }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              title={title}
              className={`flex items-center px-2.5 py-1.5 transition ${
                tool === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        {tool !== 'eraser' && (
          <div className="flex items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                title={c.label}
                className={`h-5 w-5 rounded-full border-2 transition hover:scale-110 ${
                  color === c.value ? 'scale-110 border-slate-600 dark:border-slate-300' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-1">
          {SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => setSize(s.value)}
              title={`${s.label}`}
              className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold transition ${
                size === s.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setConfirmClear(true)}
          title="Clear whiteboard"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      {/* Canvas area */}
      <div className="relative min-h-0 flex-1 bg-white">
        <canvas
          ref={canvasRef}
          width={1400}
          height={900}
          className="h-full w-full"
          style={{ cursor: canvasCursor, touchAction: 'none' }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={(e) => {
            const canvas = canvasRef.current!;
            const rect = canvas.getBoundingClientRect();
            continueDraw({
              x: (e.clientX - rect.left) * (canvas.width / rect.width),
              y: (e.clientY - rect.top) * (canvas.height / rect.height),
            });
          }}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => { e.preventDefault(); startDrawing(getTouchCanvasPos(e)); }}
          onTouchMove={(e) => { e.preventDefault(); continueDraw(getTouchCanvasPos(e)); }}
          onTouchEnd={stopDrawing}
        />

        {!hasContent && !textBox && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-slate-300 dark:text-slate-600">Draw your system design diagram here</p>
          </div>
        )}

        {/* Floating text box */}
        {textBox && (
          <div
            style={{ position: 'absolute', left: textBox.x, top: textBox.y, zIndex: 20, userSelect: 'none' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Drag handle bar */}
            <div
              onMouseDown={handleDragBarMouseDown}
              style={{ height: HEADER_H, cursor: 'move' }}
              className="flex items-center justify-between rounded-t-md bg-indigo-600 px-2"
            >
              <span className="text-[10px] font-medium text-indigo-200 select-none">Text · drag to move</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={commitTextBox}
                  title="Done"
                  className="rounded p-0.5 text-white hover:bg-indigo-500"
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={() => setTextBox(null)}
                  title="Cancel"
                  className="rounded p-0.5 text-white hover:bg-indigo-500"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Resizable textarea */}
            <div
              ref={resizeDivRef}
              style={{
                width: textBox.width,
                height: textBox.height,
                resize: 'both',
                overflow: 'hidden',
                minWidth: 120,
                minHeight: 50,
              }}
              className="border-2 border-indigo-400 rounded-b-md bg-white/95"
              onMouseUp={captureResizeSize}
            >
              <textarea
                ref={textAreaRef}
                value={textBox.value}
                onChange={(e) => setTextBox(prev => prev ? { ...prev, value: e.target.value } : null)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setTextBox(null);
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitTextBox(); }
                }}
                placeholder="Type here… (Enter to stamp, Shift+Enter for new line)"
                style={{ fontSize: FONT_SIZE[size] ?? 18, color, resize: 'none' }}
                className="h-full w-full border-0 bg-transparent p-1.5 text-slate-900 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Clear confirmation dialog */}
      {confirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setConfirmClear(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100">Clear whiteboard?</h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              This will erase everything on the canvas. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleClearConfirmed}
                className="rounded-md bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
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

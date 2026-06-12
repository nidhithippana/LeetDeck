import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eraser, Pencil, Trash2 } from 'lucide-react';

export type WhiteboardHandle = {
  getImageDataUrl: () => string;
  isEmpty: () => boolean;
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

const Whiteboard = forwardRef<WhiteboardHandle>(function Whiteboard(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState(COLORS[0].value);
  const [size, setSize] = useState(SIZES[1].value);
  const [hasContent, setHasContent] = useState(false);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
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
    drawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  };

  useImperativeHandle(ref, () => ({
    getImageDataUrl: () => canvasRef.current?.toDataURL('image/png') ?? '',
    isEmpty: () => !hasContent,
  }));

  return (
    <div ref={containerRef} className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
        {/* Tool toggle */}
        <div className="flex items-center overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setTool('pen')}
            title="Pen"
            className={`flex items-center px-2.5 py-1.5 transition ${
              tool === 'pen'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            title="Eraser"
            className={`flex items-center px-2.5 py-1.5 transition ${
              tool === 'eraser'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Eraser size={13} />
          </button>
        </div>

        {/* Color swatches */}
        {tool === 'pen' && (
          <div className="flex items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                title={c.label}
                className={`h-5 w-5 rounded-full border-2 transition hover:scale-110 ${
                  color === c.value
                    ? 'scale-110 border-slate-600 dark:border-slate-300'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        )}

        {/* Stroke size */}
        <div className="flex items-center gap-1">
          {SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => setSize(s.value)}
              title={`${s.label} stroke`}
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
          onClick={clearCanvas}
          title="Clear whiteboard"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div className="relative min-h-0 flex-1 bg-white">
        <canvas
          ref={canvasRef}
          width={1400}
          height={900}
          className="h-full w-full"
          style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', touchAction: 'none' }}
          onMouseDown={(e) => startDrawing(getPos(e))}
          onMouseMove={(e) => continueDraw(getPos(e))}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(getPos(e));
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            continueDraw(getPos(e));
          }}
          onTouchEnd={stopDrawing}
        />
        {!hasContent && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-slate-300 dark:text-slate-600">
              Draw your system design diagram here
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Whiteboard;

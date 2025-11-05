import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const GRID_SIZE = 32;
const PIXEL_SIZE = 16;

const COLORS = [
  '#9b87f5', '#D946EF', '#0EA5E9', '#F97316', '#10B981', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#14B8A6', '#DC2626',
  '#7C3AED', '#DB2777', '#0284C7', '#EA580C', '#059669', '#B91C1C',
  '#6D28D9', '#BE185D', '#0369A1', '#C2410C', '#047857', '#991B1B',
  '#FFFFFF', '#E5E7EB', '#9CA3AF', '#6B7280', '#374151', '#1F2937',
];

type Tool = 'pencil' | 'eraser' | 'fill';

const PixelEditor = () => {
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('transparent'))
  );
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [tool, setTool] = useState<Tool>('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    drawCanvas();
  }, [grid]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const color = grid[y][x];
        if (color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
      }
    }

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * PIXEL_SIZE, 0);
      ctx.lineTo(i * PIXEL_SIZE, GRID_SIZE * PIXEL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * PIXEL_SIZE);
      ctx.lineTo(GRID_SIZE * PIXEL_SIZE, i * PIXEL_SIZE);
      ctx.stroke();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);

    if (tool === 'fill') {
      floodFill(x, y);
    } else {
      drawPixel(x, y);
    }
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'fill') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);

    drawPixel(x, y);
  };

  const drawPixel = (x: number, y: number) => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

    const newGrid = [...grid];
    newGrid[y][x] = tool === 'eraser' ? 'transparent' : selectedColor;
    setGrid(newGrid);
  };

  const floodFill = (startX: number, startY: number) => {
    const targetColor = grid[startY][startX];
    if (targetColor === selectedColor) return;

    const newGrid = grid.map(row => [...row]);
    const stack: [number, number][] = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) continue;
      if (newGrid[y][x] !== targetColor) continue;

      newGrid[y][x] = selectedColor;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    setGrid(newGrid);
  };

  const clearCanvas = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('transparent')));
    toast({ title: 'Холст очищен' });
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `pixel-art-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({ title: 'Изображение сохранено!' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="p-6 flex-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Редактор</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearCanvas}>
                  <Icon name="Trash2" size={16} />
                </Button>
                <Button variant="default" size="sm" onClick={saveImage}>
                  <Icon name="Download" size={16} />
                </Button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={GRID_SIZE * PIXEL_SIZE}
              height={GRID_SIZE * PIXEL_SIZE}
              className="border-2 border-border bg-card cursor-crosshair mx-auto"
              onClick={handleCanvasClick}
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
              onMouseMove={handleCanvasMove}
              onMouseLeave={() => setIsDrawing(false)}
            />
          </div>
        </Card>

        <div className="w-full lg:w-80 space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Инструменты</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pencil', icon: 'Pencil', label: 'Карандаш' },
                { id: 'eraser', icon: 'Eraser', label: 'Ластик' },
                { id: 'fill', icon: 'PaintBucket', label: 'Заливка' },
              ].map((t) => (
                <Button
                  key={t.id}
                  variant={tool === t.id ? 'default' : 'outline'}
                  className="flex flex-col h-auto py-3 gap-1"
                  onClick={() => setTool(t.id as Tool)}
                >
                  <Icon name={t.icon as any} size={20} />
                  <span className="text-xs">{t.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Палитра</h3>
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 transition-transform hover:scale-110 ${
                    selectedColor === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div 
                className="w-12 h-12 border-2 border-border" 
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-sm text-muted-foreground">Выбранный цвет</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PixelEditor;

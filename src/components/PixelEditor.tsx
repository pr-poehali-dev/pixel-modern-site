import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type Format = 'a4' | 'a3' | 'a2' | 'a1' | 'a0' | '20x30' | '30x40' | '40x50' | '40x60' | '50x70' | '60x80' | '70x90' | '80x120' | '90x120' | '100x120';

const PixelEditor = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [format, setFormat] = useState<Format>('a4');
  const [scale, setScale] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatRatios: Record<Format, { width: number; height: number; label: string }> = {
    'a4': { width: 420, height: 594, label: 'Формат А4 (210×297 мм)' },
    'a3': { width: 594, height: 840, label: 'Формат А3 (297×420 мм)' },
    'a2': { width: 840, height: 1188, label: 'Формат А2 (420×594 мм)' },
    'a1': { width: 1188, height: 1682, label: 'Формат А1 (594×841 мм)' },
    'a0': { width: 1682, height: 2378, label: 'Формат А0 (841×1189 мм)' },
    '20x30': { width: 200, height: 300, label: '20×30 см' },
    '30x40': { width: 300, height: 400, label: '30×40 см' },
    '40x50': { width: 400, height: 500, label: '40×50 см' },
    '40x60': { width: 400, height: 600, label: '40×60 см' },
    '50x70': { width: 500, height: 700, label: '50×70 см' },
    '60x80': { width: 600, height: 800, label: '60×80 см' },
    '70x90': { width: 700, height: 900, label: '70×90 см' },
    '80x120': { width: 800, height: 1200, label: '80×120 см' },
    '90x120': { width: 900, height: 1200, label: '90×120 см' },
    '100x120': { width: 1000, height: 1200, label: '100×120 см' },
  };

  useEffect(() => {
    drawCanvas();
  }, [image, format, scale, position, rotation, flipH, flipV]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dimensions = formatRatios[format];
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scaleFactor = scale / 100;
    const imgWidth = image.width * scaleFactor;
    const imgHeight = image.height * scaleFactor;

    ctx.save();
    ctx.translate(position.x + imgWidth / 2, position.y + imgHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(
      image,
      -imgWidth / 2,
      -imgHeight / 2,
      imgWidth,
      imgHeight
    );
    ctx.restore();

    ctx.strokeStyle = '#9b87f5';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ 
        title: 'Ошибка',
        description: 'Выберите файл изображения',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        centerImage(img);
        toast({ title: 'Изображение загружено!' });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const centerImage = (img: HTMLImageElement) => {
    const dimensions = formatRatios[format];
    const scaleFactor = Math.min(
      dimensions.width / img.width,
      dimensions.height / img.height
    );
    
    setScale(scaleFactor * 100);
    setPosition({
      x: (dimensions.width - img.width * scaleFactor) / 2,
      y: (dimensions.height - img.height * scaleFactor) / 2,
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleFormatChange = (newFormat: Format) => {
    setFormat(newFormat);
    if (image) {
      centerImage(image);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      toast({ 
        title: 'Ошибка',
        description: 'Загрузите изображение',
        variant: 'destructive'
      });
      return;
    }

    const link = document.createElement('a');
    link.download = `image-${format}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    toast({ title: 'Изображение сохранено!' });
  };

  const handleReset = () => {
    if (image) {
      centerImage(image);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      toast({ title: 'Изображение сброшено' });
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlipH = () => {
    setFlipH((prev) => !prev);
  };

  const handleFlipV = () => {
    setFlipV((prev) => !prev);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!image) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      setScale((prev) => Math.max(10, Math.min(300, prev + delta)));
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="p-6 flex-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Редактор изображений</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="Upload" size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  disabled={!image}
                >
                  <Icon name="RotateCcw" size={16} />
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={!image}
                >
                  <Icon name="Download" size={16} />
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!image ? (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-20 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="ImagePlus" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Загрузите изображение</h3>
                <p className="text-muted-foreground">Нажмите или перетащите файл сюда</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border-2 border-primary cursor-move shadow-lg"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                />
              </div>
            )}
          </div>
        </Card>

        <div className="w-full lg:w-80 space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Формат</h3>
            <Select value={format} onValueChange={(v) => handleFormatChange(v as Format)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">{formatRatios.a4.label}</SelectItem>
                <SelectItem value="a3">{formatRatios.a3.label}</SelectItem>
                <SelectItem value="a2">{formatRatios.a2.label}</SelectItem>
                <SelectItem value="a1">{formatRatios.a1.label}</SelectItem>
                <SelectItem value="a0">{formatRatios.a0.label}</SelectItem>
                <SelectItem value="20x30">{formatRatios['20x30'].label}</SelectItem>
                <SelectItem value="30x40">{formatRatios['30x40'].label}</SelectItem>
                <SelectItem value="40x50">{formatRatios['40x50'].label}</SelectItem>
                <SelectItem value="40x60">{formatRatios['40x60'].label}</SelectItem>
                <SelectItem value="50x70">{formatRatios['50x70'].label}</SelectItem>
                <SelectItem value="60x80">{formatRatios['60x80'].label}</SelectItem>
                <SelectItem value="70x90">{formatRatios['70x90'].label}</SelectItem>
                <SelectItem value="80x120">{formatRatios['80x120'].label}</SelectItem>
                <SelectItem value="90x120">{formatRatios['90x120'].label}</SelectItem>
                <SelectItem value="100x120">{formatRatios['100x120'].label}</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Масштаб</h3>
                <span className="text-sm text-muted-foreground">{scale.toFixed(0)}%</span>
              </div>
              <Slider
                value={[scale]}
                onValueChange={(v) => setScale(v[0])}
                min={10}
                max={300}
                step={1}
                disabled={!image}
              />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Трансформация</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                disabled={!image}
                className="flex flex-col h-auto py-3 gap-1"
              >
                <Icon name="RotateCw" size={20} />
                <span className="text-xs">Повернуть</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFlipH}
                disabled={!image}
                className="flex flex-col h-auto py-3 gap-1"
              >
                <Icon name="FlipHorizontal" size={20} />
                <span className="text-xs">Отр. гор.</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFlipV}
                disabled={!image}
                className="flex flex-col h-auto py-3 gap-1"
              >
                <Icon name="FlipVertical" size={20} />
                <span className="text-xs">Отр. верт.</span>
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="font-semibold text-lg">Инструкция</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Icon name="Upload" size={16} className="mt-0.5 shrink-0" />
                <span>Загрузите изображение</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Maximize2" size={16} className="mt-0.5 shrink-0" />
                <span>Выберите формат обрезки</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Move" size={16} className="mt-0.5 shrink-0" />
                <span>Перетащите изображение мышью</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="ZoomIn" size={16} className="mt-0.5 shrink-0" />
                <span>Масштаб: слайдер или колёсико мыши</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="RotateCw" size={16} className="mt-0.5 shrink-0" />
                <span>Трансформация: поворот и отражение</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Download" size={16} className="mt-0.5 shrink-0" />
                <span>Сохраните результат</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="space-y-2">
              <h3 className="font-semibold">Совет</h3>
              <p className="text-sm text-muted-foreground">
                Используйте мышь для перемещения изображения внутри области обрезки. 
                Слайдер масштаба поможет подогнать размер.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PixelEditor;
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type Format = 'square' | '16:9' | '4:3' | '1:1' | '9:16';

const PixelEditor = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [format, setFormat] = useState<Format>('square');
  const [scale, setScale] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatRatios: Record<Format, { width: number; height: number }> = {
    'square': { width: 500, height: 500 },
    '1:1': { width: 500, height: 500 },
    '16:9': { width: 640, height: 360 },
    '4:3': { width: 480, height: 360 },
    '9:16': { width: 360, height: 640 },
  };

  useEffect(() => {
    drawCanvas();
  }, [image, format, scale, position]);

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

    ctx.drawImage(
      image,
      position.x,
      position.y,
      imgWidth,
      imgHeight
    );

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
      toast({ title: 'Изображение отцентрировано' });
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
                <SelectItem value="square">Квадрат (500×500)</SelectItem>
                <SelectItem value="1:1">1:1 (500×500)</SelectItem>
                <SelectItem value="16:9">16:9 (640×360)</SelectItem>
                <SelectItem value="4:3">4:3 (480×360)</SelectItem>
                <SelectItem value="9:16">9:16 (360×640)</SelectItem>
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
                <span>Измените масштаб слайдером</span>
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
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type MosaicType = 'lego' | 'round' | 'square';
type BaseType = 'canvas' | 'stretcher';
type Orientation = 'landscape' | 'portrait' | 'square';

interface FormatOption {
  width: number;
  height: number;
  label: string;
}

const PixelEditor = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [mosaicType, setMosaicType] = useState<MosaicType>('lego');
  const [baseType, setBaseType] = useState<BaseType>('canvas');
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [format, setFormat] = useState<string>('a4');
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

  const landscapeFormats: Record<string, FormatOption> = {
    'a4': { width: 420, height: 594, label: 'Формат А4 (210x297)' },
    'a3': { width: 594, height: 840, label: 'Формат А3 (297x420)' },
    'a2': { width: 840, height: 1188, label: 'Формат А2 (420x594)' },
    'a1': { width: 1188, height: 1682, label: 'Формат А1 (594x841)' },
    'a0': { width: 1682, height: 2378, label: 'Формат А0 (841x1189)' },
    '20x30': { width: 200, height: 300, label: '20x30 см.' },
    '30x40': { width: 300, height: 400, label: '30x40 см.' },
    '40x50': { width: 400, height: 500, label: '40x50 см.' },
    '40x60': { width: 400, height: 600, label: '40x60 см.' },
    '50x70': { width: 500, height: 700, label: '50x70 см.' },
    '60x80': { width: 600, height: 800, label: '60x80 см.' },
    '70x90': { width: 700, height: 900, label: '70x90 см.' },
    '80x120': { width: 800, height: 1200, label: '80x120 см.' },
    '90x120': { width: 900, height: 1200, label: '90x120 см.' },
    '100x120': { width: 1000, height: 1200, label: '100x120 см.' },
  };

  const portraitFormats: Record<string, FormatOption> = {
    'a4': { width: 594, height: 420, label: 'Формат А4 (297x210)' },
    'a3': { width: 840, height: 594, label: 'Формат А3 (420x297)' },
    'a2': { width: 1188, height: 840, label: 'Формат А2 (594x420)' },
    'a1': { width: 1682, height: 1188, label: 'Формат А1 (841x594)' },
    'a0': { width: 2378, height: 1682, label: 'Формат А0 (1189x841)' },
    '30x20': { width: 300, height: 200, label: '30x20 см.' },
    '40x30': { width: 400, height: 300, label: '40x30 см.' },
    '50x40': { width: 500, height: 400, label: '50x40 см.' },
    '60x40': { width: 600, height: 400, label: '60x40 см.' },
    '70x50': { width: 700, height: 500, label: '70x50 см.' },
    '80x60': { width: 800, height: 600, label: '80x60 см.' },
    '90x70': { width: 900, height: 700, label: '90x70 см.' },
    '120x80': { width: 1200, height: 800, label: '120x80 см.' },
    '120x90': { width: 1200, height: 900, label: '120x90 см.' },
    '120x100': { width: 1200, height: 1000, label: '120x100 см.' },
  };

  const squareFormats: Record<string, FormatOption> = {
    '20x20': { width: 200, height: 200, label: '20x20 см.' },
    '30x30': { width: 300, height: 300, label: '30x30 см.' },
    '40x40': { width: 400, height: 400, label: '40x40 см.' },
    '50x50': { width: 500, height: 500, label: '50x50 см.' },
    '60x60': { width: 600, height: 600, label: '60x60 см.' },
    '70x70': { width: 700, height: 700, label: '70x70 см.' },
    '80x80': { width: 800, height: 800, label: '80x80 см.' },
    '90x90': { width: 900, height: 900, label: '90x90 см.' },
    '100x100': { width: 1000, height: 1000, label: '100x100 см.' },
    '110x110': { width: 1100, height: 1100, label: '110x110 см.' },
    '120x120': { width: 1200, height: 1200, label: '120x120 см.' },
  };

  const getFormats = () => {
    switch (orientation) {
      case 'landscape':
        return landscapeFormats;
      case 'portrait':
        return portraitFormats;
      case 'square':
        return squareFormats;
    }
  };

  const getCurrentDimensions = (): FormatOption => {
    const formats = getFormats();
    return formats[format] || formats['a4'];
  };

  useEffect(() => {
    const formats = getFormats();
    if (!formats[format]) {
      setFormat(Object.keys(formats)[0]);
    }
  }, [orientation]);

  useEffect(() => {
    drawCanvas();
  }, [image, format, scale, position, rotation, flipH, flipV, orientation]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dimensions = getCurrentDimensions();
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
    const dimensions = getCurrentDimensions();
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

  const handleFormatChange = (newFormat: string) => {
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
    link.download = `mosaic-${mosaicType}-${format}-${Date.now()}.png`;
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

  const showBaseTypeSelector = mosaicType === 'round' || mosaicType === 'square';

  return (
    <div className="animate-fade-in">
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold">Редактор мозаики</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 items-end">
            <div>
              <Label className="text-xs mb-1 block">Тип мозаики</Label>
              <Select value={mosaicType} onValueChange={(v) => setMosaicType(v as MosaicType)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lego">Лего</SelectItem>
                  <SelectItem value="round">Круглые стразы</SelectItem>
                  <SelectItem value="square">Квадратные стразы</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showBaseTypeSelector && (
              <div>
                <Label className="text-xs mb-1 block">Основа</Label>
                <Select value={baseType} onValueChange={(v) => setBaseType(v as BaseType)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canvas">Холст</SelectItem>
                    <SelectItem value="stretcher">Подрамник</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-xs mb-1 block">Ориентация</Label>
              <Select value={orientation} onValueChange={(v) => setOrientation(v as Orientation)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Альбомная</SelectItem>
                  <SelectItem value="portrait">Книжная</SelectItem>
                  <SelectItem value="square">Квадрат</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Label className="text-xs mb-1 block">Формат</Label>
              <Select value={format} onValueChange={handleFormatChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(getFormats()).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {image && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs mb-1 block">Масштаб: {scale}%</Label>
                <Slider
                  value={[scale]}
                  onValueChange={([v]) => setScale(v)}
                  min={10}
                  max={300}
                  step={5}
                  className="mb-2"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  className="flex-1"
                >
                  <Icon name="RotateCw" size={16} className="mr-1" />
                  Повернуть
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlipH}
                  className="flex-1"
                >
                  <Icon name="FlipHorizontal" size={16} className="mr-1" />
                  Отразить Г
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlipV}
                  className="flex-1"
                >
                  <Icon name="FlipVertical" size={16} className="mr-1" />
                  Отразить В
                </Button>
              </div>
            </div>
          )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

          {!image ? (
            <div 
              className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="ImagePlus" size={48} className="mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-1">Загрузите изображение</h3>
              <p className="text-sm text-muted-foreground">Нажмите или перетащите файл</p>
            </div>
          ) : (
            <div className="overflow-auto max-h-[70vh] border-2 border-border rounded-lg">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className="cursor-move max-w-full h-auto"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PixelEditor;
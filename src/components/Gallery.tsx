import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Gallery = () => {
  const examples = [
    { title: 'Пиксельное сердце', author: 'Мария', color: 'from-secondary to-pink-600' },
    { title: 'Космический корабль', author: 'Алексей', color: 'from-accent to-blue-600' },
    { title: 'Милый персонаж', author: 'Елена', color: 'from-primary to-purple-600' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Галерея работ</h1>
        <p className="text-muted-foreground">Вдохновитесь творениями других художников</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((item, i) => (
          <Card key={i} className="overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
            <div className={`h-48 bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:animate-pixel-pop`}>
              <Icon name="Image" size={64} className="text-white/50" />
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">Автор: {item.author}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 text-center space-y-4 bg-muted/50">
        <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Поделитесь своим творением</h3>
          <p className="text-muted-foreground">Скоро здесь появится возможность загружать свои работы!</p>
        </div>
      </Card>
    </div>
  );
};

export default Gallery;

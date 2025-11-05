import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Contacts = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ 
      title: 'Сообщение отправлено!',
      description: 'Мы свяжемся с вами в ближайшее время.'
    });
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Контакты</h1>
        <p className="text-muted-foreground">Свяжитесь с нами</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Имя</label>
              <Input placeholder="Ваше имя" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="your@email.com" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Сообщение</label>
              <Textarea 
                placeholder="Ваше сообщение..." 
                rows={5}
                required 
              />
            </div>
            
            <Button type="submit" className="w-full gap-2">
              <Icon name="Send" size={16} />
              Отправить сообщение
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary flex items-center justify-center">
                <Icon name="Mail" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">support@pixelmosaic.com</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                <Icon name="MessageCircle" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Telegram</h3>
                <p className="text-muted-foreground">@pixelmosaic</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent flex items-center justify-center">
                <Icon name="Github" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">GitHub</h3>
                <p className="text-muted-foreground">github.com/pixelmosaic</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
            <h3 className="font-semibold mb-2">Открыты к сотрудничеству</h3>
            <p className="text-sm text-muted-foreground">
              Есть идеи по улучшению проекта? Хотите помочь с разработкой? 
              Мы всегда рады новым участникам команды!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contacts;

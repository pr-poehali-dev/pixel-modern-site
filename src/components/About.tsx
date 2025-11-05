import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const About = () => {
  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">О проекте</h1>
        <p className="text-muted-foreground">История создания Pixel Mosaic</p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Что такое Pixel Mosaic?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pixel Mosaic — это современный веб-редактор для создания пиксельной графики. 
            Проект создан для художников, дизайнеров и всех, кто любит pixel art. 
            Мы объединили классическую эстетику пиксельной графики с современными 
            веб-технологиями, чтобы создать удобный и красивый инструмент для творчества.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Миссия проекта</h2>
          <p className="text-muted-foreground leading-relaxed">
            Мы хотим сделать создание пиксельной графики доступным каждому. Никаких сложных 
            программ, только браузер и ваше воображение. Pixel Mosaic работает полностью 
            онлайн — просто откройте сайт и начните творить!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 pt-4">
          {[
            { icon: 'Zap', title: 'Быстро', desc: 'Работает прямо в браузере' },
            { icon: 'Sparkles', title: 'Просто', desc: 'Интуитивный интерфейс' },
            { icon: 'Heart', title: 'Бесплатно', desc: 'Свободный доступ для всех' }
          ].map((feature, i) => (
            <Card key={i} className="p-4 space-y-2 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-primary flex items-center justify-center mx-auto">
                <Icon name={feature.icon as any} size={24} />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-8 space-y-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <h2 className="text-2xl font-bold">Технологии</h2>
        <p className="text-muted-foreground">
          Проект построен на современном стеке: React, TypeScript, Tailwind CSS. 
          Мы используем Canvas API для отрисовки пикселей и создания изображений.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {['React', 'TypeScript', 'Canvas', 'Tailwind CSS', 'Vite'].map((tech) => (
            <span key={tech} className="px-3 py-1 bg-background border border-border text-sm font-mono">
              {tech}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default About;

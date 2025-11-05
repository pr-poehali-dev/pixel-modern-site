import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const About = () => {
  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">О проекте</h1>
        <p className="text-muted-foreground">История создания MARlik Pixel Mix</p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Что такое MARlik Pixel Mix?</h2>
          <p className="text-muted-foreground leading-relaxed">
            MARlik Pixel Mix — это профессиональный веб-редактор для подготовки изображений к печати. 
            Проект создан для художников, дизайнеров, мастеров алмазной мозаики и всех, 
            кто работает с печатью изображений. Мы объединили удобство веб-технологий 
            с профессиональными инструментами обработки изображений.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Миссия проекта</h2>
          <p className="text-muted-foreground leading-relaxed">
            Мы хотим упростить подготовку изображений для печати. Никаких сложных 
            программ — только браузер и ваши изображения. MARlik Pixel Mix работает полностью 
            онлайн: выбирайте формат, обрезайте, масштабируйте и сохраняйте!
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
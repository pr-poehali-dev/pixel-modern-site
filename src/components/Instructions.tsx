import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const Instructions = () => {
  const steps = [
    {
      icon: 'MousePointer',
      title: 'Выберите инструмент',
      desc: 'Карандаш для рисования, ластик для стирания, заливка для быстрого заполнения области'
    },
    {
      icon: 'Palette',
      title: 'Подберите цвет',
      desc: 'Кликните на нужный цвет в палитре. Выбранный цвет отображается в большом квадрате'
    },
    {
      icon: 'Hand',
      title: 'Рисуйте на холсте',
      desc: 'Кликайте по клеткам или зажмите кнопку мыши и ведите для непрерывного рисования'
    },
    {
      icon: 'Download',
      title: 'Сохраните результат',
      desc: 'Нажмите кнопку загрузки, чтобы сохранить ваше творение в формате PNG'
    }
  ];

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Инструкция</h1>
        <p className="text-muted-foreground">Как создавать пиксельные шедевры</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <Card key={i} className="p-6 space-y-3 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                <Icon name={step.icon as any} size={24} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Шаг {i + 1}</div>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
            </div>
            <p className="text-muted-foreground">{step.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Частые вопросы</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>Как изменить размер холста?</AccordionTrigger>
            <AccordionContent>
              Текущий размер холста — 32x32 пикселя. Это оптимальный размер для создания 
              детализированных пиксельных изображений. В будущих версиях планируется добавить 
              возможность выбора размера.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q2">
            <AccordionTrigger>Как работает инструмент заливки?</AccordionTrigger>
            <AccordionContent>
              Заливка закрашивает все соседние пиксели одного цвета. Кликните на пиксель, 
              и все соединённые с ним пиксели такого же цвета изменятся на выбранный.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q3">
            <AccordionTrigger>Можно ли добавить свой цвет?</AccordionTrigger>
            <AccordionContent>
              Сейчас доступна палитра из 30 цветов, специально подобранных для пиксель-арта. 
              Возможность добавления пользовательских цветов планируется в следующих обновлениях.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q4">
            <AccordionTrigger>Сохраняется ли моя работа автоматически?</AccordionTrigger>
            <AccordionContent>
              Пока автосохранение не реализовано. Обязательно сохраняйте работу через кнопку 
              загрузки перед закрытием страницы. Функция автосохранения в разработке!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default Instructions;

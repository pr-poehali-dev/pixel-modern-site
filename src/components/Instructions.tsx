import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const Instructions = () => {
  const steps = [
    {
      icon: 'Upload',
      title: 'Загрузите изображение',
      desc: 'Нажмите кнопку загрузки или кликните в область с пунктирной рамкой'
    },
    {
      icon: 'Crop',
      title: 'Выберите формат',
      desc: 'Выберите нужный формат: А0-А4 или размеры 20×30 - 100×120 см'
    },
    {
      icon: 'Move',
      title: 'Позиционируйте изображение',
      desc: 'Перетаскивайте изображение мышью, масштабируйте колёсиком или слайдером'
    },
    {
      icon: 'RotateCw',
      title: 'Трансформируйте',
      desc: 'Поворачивайте на 90° или отражайте по вертикали/горизонтали'
    },
    {
      icon: 'Download',
      title: 'Сохраните результат',
      desc: 'Экспортируйте готовое изображение в высоком качестве PNG'
    }
  ];

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Инструкция</h1>
        <p className="text-muted-foreground">Как подготовить изображение к печати</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <Card key={i} className="p-6 space-y-3 hover:scale-105 transition-transform relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full" />
            <div className="flex items-center gap-3 relative">
              <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                <Icon name={step.icon as any} size={24} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Шаг {i + 1}</div>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
            </div>
            <p className="text-muted-foreground relative">{step.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Частые вопросы</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>Какие форматы доступны?</AccordionTrigger>
            <AccordionContent>
              Доступны стандартные форматы А0, А1, А2, А3, А4, а также популярные размеры 
              для печати: 20×30, 30×40, 40×50, 40×60, 50×70, 60×80, 70×90, 80×120, 90×120, 100×120 см.
              Все размеры рассчитаны с учётом пропорций для качественной печати.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q2">
            <AccordionTrigger>Как масштабировать изображение?</AccordionTrigger>
            <AccordionContent>
              Есть два способа: используйте слайдер "Масштаб" или наведите курсор на изображение 
              и прокручивайте колёсико мыши. Масштабирование колёсиком работает только когда 
              курсор находится над изображением, чтобы не мешать прокрутке страницы.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q3">
            <AccordionTrigger>Как работают кнопки трансформации?</AccordionTrigger>
            <AccordionContent>
              "Повернуть" — поворачивает изображение на 90° по часовой стрелке (можно нажимать несколько раз).
              "Отр. гор." — отражает изображение по горизонтали (зеркально).
              "Отр. верт." — отражает изображение по вертикали (переворачивает).
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q4">
            <AccordionTrigger>В каком формате сохраняется изображение?</AccordionTrigger>
            <AccordionContent>
              Изображение сохраняется в формате PNG с прозрачностью. Это оптимальный формат 
              для печати, так как сохраняет высокое качество без потерь. Размер файла 
              соответствует выбранному формату рамки.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5">
            <AccordionTrigger>Что делает кнопка "Сброс"?</AccordionTrigger>
            <AccordionContent>
              Кнопка со стрелкой возвращает изображение в исходное состояние: центрирует его, 
              сбрасывает масштаб к оптимальному значению, убирает все повороты и отражения. 
              Полезно, если нужно начать настройку заново.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
            <Icon name="Lightbulb" size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Совет профессионала</h3>
            <p className="text-muted-foreground">
              Для лучшего результата используйте изображения высокого разрешения. 
              Если изображение после масштабирования выглядит размытым, попробуйте 
              загрузить версию в большем разрешении. Минимальное рекомендуемое 
              разрешение — 1500×1500 пикселей для форматов А4 и выше.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Instructions;
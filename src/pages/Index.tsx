import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import PixelEditor from '@/components/PixelEditor';
import Gallery from '@/components/Gallery';
import Instructions from '@/components/Instructions';
import About from '@/components/About';
import Contacts from '@/components/Contacts';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-primary via-secondary to-accent" />
              <span className="text-xl font-bold">PIXEL MOSAIC</span>
            </div>
            
            <div className="flex gap-1">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'editor', label: 'Редактор', icon: 'Pencil' },
                { id: 'gallery', label: 'Галерея', icon: 'Images' },
                { id: 'instructions', label: 'Инструкция', icon: 'BookOpen' },
                { id: 'about', label: 'О проекте', icon: 'Info' },
                { id: 'contacts', label: 'Контакты', icon: 'Mail' },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="gap-2 transition-all"
                >
                  <Icon name={tab.icon as any} size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-8">
            <section className="text-center py-20 space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                PIXEL MOSAIC
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Создавайте пиксельные шедевры в современном редакторе. 
                Рисуйте, сохраняйте и делитесь своими творениями.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  onClick={() => setActiveTab('editor')}
                  className="gap-2 text-lg"
                >
                  <Icon name="Sparkles" size={20} />
                  Начать создавать
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setActiveTab('gallery')}
                  className="gap-2 text-lg"
                >
                  <Icon name="Images" size={20} />
                  Посмотреть галерею
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'Palette',
                  title: 'Богатая палитра',
                  desc: 'Десятки готовых цветов для вашего творчества',
                  color: 'from-primary to-purple-600'
                },
                {
                  icon: 'Wand2',
                  title: 'Удобные инструменты',
                  desc: 'Карандаш, ластик, заливка и другие функции',
                  color: 'from-secondary to-pink-600'
                },
                {
                  icon: 'Download',
                  title: 'Экспорт работ',
                  desc: 'Сохраняйте свои творения в PNG формате',
                  color: 'from-accent to-blue-600'
                }
              ].map((feature, i) => (
                <Card key={i} className="p-6 space-y-3 hover:scale-105 transition-transform cursor-pointer group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <Icon name={feature.icon as any} size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </Card>
              ))}
            </section>
          </div>
        )}

        {activeTab === 'editor' && <PixelEditor />}
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'instructions' && <Instructions />}
        {activeTab === 'about' && <About />}
        {activeTab === 'contacts' && <Contacts />}
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Pixel Mosaic. Создано с ❤️ для любителей пиксель-арта</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
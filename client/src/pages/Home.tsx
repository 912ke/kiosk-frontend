import { NavigationTile } from '@/components/NavigationTile';
import { CalendarDays, CreditCard, UserPlus, Info, HelpCircle, Globe } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold">SimRacing Club</h1>
          <p className="text-xl text-muted-foreground">
            г. Алматы, ул. Примерная 123
          </p>
          <p className="text-lg text-muted-foreground">
            Ежедневно 12:00 - 00:00
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <NavigationTile
            icon={UserPlus}
            title="Регистрация"
            subtitle="Создать аккаунт"
            onClick={() => navigate('/register')}
            testId="tile-register"
          />
          <NavigationTile
            icon={CreditCard}
            title="Пополнить"
            subtitle="Депозит"
            onClick={() => navigate('/deposit')}
            testId="tile-deposit"
          />
          <NavigationTile
            icon={CalendarDays}
            title="Бронирование"
            subtitle="Забронировать время"
            onClick={() => navigate('/booking')}
            testId="tile-booking"
          />
          <NavigationTile
            icon={Info}
            title="О нас"
            subtitle="Информация о клубе"
            onClick={() => navigate('/about')}
            testId="tile-about"
          />
        </div>
      </div>

      <footer className="p-6 border-t border-border">
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="ghost"
            size="lg"
            className="gap-2"
            onClick={() => console.log('Help requested')}
            data-testid="button-help"
          >
            <HelpCircle className="w-5 h-5" />
            Помощь администратора
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="gap-2"
            onClick={() => console.log('Language change')}
            data-testid="button-language"
          >
            <Globe className="w-5 h-5" />
            Изменить язык
          </Button>
        </div>
      </footer>
    </div>
  );
}

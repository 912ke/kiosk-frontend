import { NavigationTile } from '../NavigationTile';
import { CalendarDays, CreditCard, UserPlus, Info } from 'lucide-react';

export default function NavigationTileExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <NavigationTile
          icon={UserPlus}
          title="Регистрация"
          subtitle="Создать аккаунт"
          onClick={() => console.log('Register clicked')}
        />
        <NavigationTile
          icon={CreditCard}
          title="Пополнить"
          subtitle="Депозит"
          onClick={() => console.log('Deposit clicked')}
        />
        <NavigationTile
          icon={CalendarDays}
          title="Бронирование"
          subtitle="Забронировать время"
          onClick={() => console.log('Booking clicked')}
        />
        <NavigationTile
          icon={Info}
          title="О нас"
          subtitle="Информация о клубе"
          onClick={() => console.log('About clicked')}
        />
      </div>
    </div>
  );
}

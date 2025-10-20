import { KioskHeader } from '@/components/KioskHeader';
import { Card } from '@/components/ui/card';
import { QRDisplay } from '@/components/QRDisplay';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <KioskHeader title="О нас" />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          <Card className="p-8 space-y-6">
            <h2 className="text-3xl font-bold">SimRacing Club</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Добро пожаловать в SimRacing Club - лучший симрейсинг клуб в Алматы. 
              Мы предлагаем профессиональное оборудование и незабываемые впечатления 
              от виртуальных гонок.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Адрес
              </h3>
              <p className="text-muted-foreground">
                г. Алматы, ул. Примерная 123
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Часы работы
              </h3>
              <p className="text-muted-foreground">
                Ежедневно: 12:00 - 00:00
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Телефон
              </h3>
              <p className="text-muted-foreground">
                +7 777 123 45 67
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email
              </h3>
              <p className="text-muted-foreground">
                info@simracing.club
              </p>
            </Card>
          </div>

          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Правила клуба</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Бережное отношение к оборудованию</li>
              <li>• Запрещается употребление еды и напитков в гоночной зоне</li>
              <li>• Отмена бронирования возможна за 2 часа до начала</li>
              <li>• Опоздание более 15 минут приравнивается к неявке</li>
              <li>• Детям до 12 лет необходимо сопровождение взрослых</li>
            </ul>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-4">
              <h3 className="text-xl font-semibold text-center">Telegram</h3>
              <QRDisplay
                data="https://t.me/simracingclub"
                expiryMinutes={999}
              />
            </Card>

            <Card className="p-8 space-y-4">
              <h3 className="text-xl font-semibold text-center">Instagram</h3>
              <QRDisplay
                data="https://instagram.com/simracingclub"
                expiryMinutes={999}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

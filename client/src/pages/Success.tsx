import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Success() {
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const type = params.get('type');
  const bookingId = params.get('bookingId');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getMessage = () => {
    switch (type) {
      case 'register':
        return {
          title: 'Регистрация завершена',
          description: 'Вы успешно зарегистрированы в системе',
        };
      case 'deposit':
        return {
          title: 'Депозит пополнен',
          description: 'Средства успешно зачислены на ваш счет',
        };
      case 'booking':
        return {
          title: 'Бронирование подтверждено',
          description: bookingId ? `Номер брони: ${bookingId}` : 'Ваше бронирование успешно создано',
        };
      default:
        return {
          title: 'Операция выполнена',
          description: 'Действие выполнено успешно',
        };
    }
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full p-12 space-y-8 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="w-36 h-36 text-chart-2" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{message.title}</h1>
          <p className="text-xl text-muted-foreground">{message.description}</p>
        </div>

        <div className="pt-8 space-y-4">
          <p className="text-muted-foreground">
            Автоматический переход на главную через 10 секунд
          </p>
          <Button
            size="lg"
            className="w-full h-16 text-xl"
            onClick={() => navigate('/')}
            data-testid="button-home"
          >
            На главную
          </Button>
        </div>
      </Card>
    </div>
  );
}

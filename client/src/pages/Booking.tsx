import { useState, useEffect } from 'react';
import { KioskHeader } from '@/components/KioskHeader';
import { SlotCard } from '@/components/SlotCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { useBookingStore } from '@/store/bookingStore';
import { useClientStore } from '@/store/clientStore';
import { Calendar, Clock, Users, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import type { Host, TimeSlot } from '@shared/schema';

type BookingStep = 'hall' | 'datetime' | 'slots' | 'confirm';

interface HallGroup {
  id: number;
  name: string;
  online: number;
  total: number;
}

export default function Booking() {
  const [, navigate] = useLocation();
  const { duration, count, setBookingData } = useBookingStore();
  const { phone, name } = useClientStore();
  const { toast } = useToast();
  const [step, setStep] = useState<BookingStep>('hall');
  const [selectedHall, setSelectedHall] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [halls, setHalls] = useState<HallGroup[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);

  const durations = [60, 90, 120];

  useEffect(() => {
    loadHalls();
  }, []);

  useEffect(() => {
    if (step === 'slots' && selectedDate && duration) {
      loadSlots();
    }
  }, [step, selectedDate, duration, count]);

  const loadHalls = async () => {
    try {
      setLoading(true);
      const allHosts = await api.getHosts(false, false);
      setHosts(allHosts);
      
      const hallGroups = allHosts.reduce((acc, host) => {
        if (host.groupId) {
          if (!acc[host.groupId]) {
            acc[host.groupId] = {
              id: host.groupId,
              name: host.groupName || `Зал ${host.groupId}`,
              online: 0,
              total: 0,
            };
          }
          acc[host.groupId].total++;
          if (host.online) acc[host.groupId].online++;
        }
        return acc;
      }, {} as Record<number, HallGroup>);

      setHalls(Object.values(hallGroups));
    } catch (error) {
      console.error('Error loading halls:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список залов',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async () => {
    try {
      setLoading(true);
      const availableSlots = await api.getSlots({
        date: selectedDate,
        start: '12:00',
        end: '00:00',
        duration_minutes: duration,
        step_minutes: 30,
        count,
      });
      setSlots(availableSlots);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить доступные слоты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHallSelect = (hallId: number) => {
    setSelectedHall(hallId);
    setBookingData({ hallId });
    setStep('datetime');
  };

  const handleDateTimeNext = () => {
    if (selectedDate && duration) {
      setBookingData({ date: selectedDate, duration, count });
      setStep('slots');
    }
  };

  const handleSlotSelect = (time: string) => {
    setSelectedTime(time);
    const from = `${selectedDate} ${time}:00`;
    const to = dayjs(`${selectedDate} ${time}`).add(duration, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    setBookingData({ from, to });
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!selectedTime || !selectedHall) return;

    try {
      setLoading(true);
      
      const selectedHosts = hosts
        .filter(h => h.groupId === selectedHall && h.online)
        .slice(0, count)
        .map(h => h.id);

      if (selectedHosts.length < count) {
        toast({
          title: 'Ошибка',
          description: 'Недостаточно доступных ригов',
          variant: 'destructive',
        });
        return;
      }

      const from = `${selectedDate} ${selectedTime}:00`;
      const to = dayjs(`${selectedDate} ${selectedTime}`).add(duration, 'minutes').format('YYYY-MM-DD HH:mm:ss');

      const result = await api.createBooking({
        hosts: selectedHosts,
        from,
        to,
        comment: '',
        clientPhone: phone || undefined,
        clientName: name || undefined,
      });

      if (result.ok && result.booking) {
        navigate(`/success?type=booking&bookingId=${result.booking.id}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать бронирование',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = ['Зал', 'Время', 'Слоты', 'Подтверждение'];
    const stepIndex = ['hall', 'datetime', 'slots', 'confirm'].indexOf(step);
    
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              i <= stepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {i + 1}
            </div>
            <span className={i <= stepIndex ? 'text-foreground' : 'text-muted-foreground'}>
              {s}
            </span>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <KioskHeader title="Бронирование" onBack={() => step === 'hall' ? navigate('/') : setStep('hall')} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {renderStepIndicator()}

          {step === 'hall' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Выберите зал</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {halls.map((hall) => (
                  <Card
                    key={hall.id}
                    className="p-8 hover-elevate active-elevate-2 cursor-pointer overflow-visible"
                    onClick={() => handleHallSelect(hall.id)}
                    data-testid={`card-hall-${hall.id}`}
                  >
                    <h3 className="text-2xl font-semibold mb-4">{hall.name}</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>Доступно: {hall.online} из {hall.total}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {Array.from({ length: hall.total }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < hall.online ? 'bg-chart-2' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 'datetime' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Дата
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    size="lg"
                    variant={selectedDate === dayjs().format('YYYY-MM-DD') ? 'default' : 'outline'}
                    onClick={() => setSelectedDate(dayjs().format('YYYY-MM-DD'))}
                    className="h-16 text-lg"
                    data-testid="button-date-today"
                  >
                    Сегодня
                  </Button>
                  <Button
                    size="lg"
                    variant={selectedDate === dayjs().add(1, 'day').format('YYYY-MM-DD') ? 'default' : 'outline'}
                    onClick={() => setSelectedDate(dayjs().add(1, 'day').format('YYYY-MM-DD'))}
                    className="h-16 text-lg"
                    data-testid="button-date-tomorrow"
                  >
                    Завтра
                  </Button>
                  <Button
                    size="lg"
                    variant={![dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'day').format('YYYY-MM-DD')].includes(selectedDate) ? 'default' : 'outline'}
                    onClick={() => setSelectedDate(dayjs().add(2, 'day').format('YYYY-MM-DD'))}
                    className="h-16 text-lg"
                    data-testid="button-date-other"
                  >
                    {dayjs().add(2, 'day').format('DD.MM')}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Длительность
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {durations.map((dur) => (
                    <Button
                      key={dur}
                      size="lg"
                      variant={duration === dur ? 'default' : 'outline'}
                      onClick={() => setBookingData({ duration: dur })}
                      className="h-16 text-lg"
                      data-testid={`button-duration-${dur}`}
                    >
                      {dur} мин
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xl flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Количество ригов
                </Label>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((c) => (
                    <Button
                      key={c}
                      size="lg"
                      variant={count === c ? 'default' : 'outline'}
                      onClick={() => setBookingData({ count: c })}
                      className="h-16 text-lg"
                      data-testid={`button-count-${c}`}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-16 text-xl"
                onClick={handleDateTimeNext}
                disabled={!selectedDate || !duration}
                data-testid="button-next-slots"
              >
                Далее
              </Button>
            </div>
          )}

          {step === 'slots' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Доступные слоты</h2>
              <p className="text-muted-foreground">
                {dayjs(selectedDate).format('DD MMMM YYYY')} • {duration} минут • {count} риг(ов)
              </p>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : slots.length > 0 ? (
                <div className="space-y-4">
                  {slots.map((slot) => {
                    const startTime = dayjs(slot.start).format('HH:mm');
                    const endTime = dayjs(slot.end).format('HH:mm');
                    return (
                      <SlotCard
                        key={slot.start}
                        timeRange={`${startTime}-${endTime}`}
                        available={slot.available}
                        price={2500}
                        onBook={() => handleSlotSelect(startTime)}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  На выбранную дату нет доступных слотов
                </Card>
              )}
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-8">
              <Card className="p-8 space-y-6">
                <h2 className="text-2xl font-semibold">Подтверждение бронирования</h2>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Зал:</span>
                    <span className="font-semibold">{halls.find(h => h.id === selectedHall)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата:</span>
                    <span className="font-semibold">{dayjs(selectedDate).format('DD MMMM YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Время:</span>
                    <span className="font-semibold">
                      {selectedTime} - {dayjs(`2024-01-01 ${selectedTime}`).add(duration, 'minutes').format('HH:mm')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Количество:</span>
                    <span className="font-semibold">{count} риг(ов)</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-xl">
                    <span className="text-muted-foreground">Итого:</span>
                    <span className="font-bold text-primary">₸{(2500 * count).toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full h-16 text-xl"
                  onClick={handleConfirm}
                  disabled={loading}
                  data-testid="button-confirm-booking"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    'Подтвердить бронирование'
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-16 text-xl"
                  onClick={() => setStep('slots')}
                  data-testid="button-back-to-slots"
                >
                  Назад к слотам
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

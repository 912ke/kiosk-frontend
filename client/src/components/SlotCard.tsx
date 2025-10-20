import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';

interface SlotCardProps {
  timeRange: string;
  available: number;
  price?: number;
  onBook: () => void;
  disabled?: boolean;
}

export function SlotCard({ timeRange, available, price, onBook, disabled }: SlotCardProps) {
  return (
    <Card className="p-6 hover-elevate overflow-visible">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Clock className="w-8 h-8 text-primary" />
            {timeRange}
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-6 h-6" />
              <span>Доступно: {available}</span>
            </div>
            {price && <span>₸{price.toLocaleString()}</span>}
          </div>
        </div>
        
        <Button
          size="lg"
          onClick={onBook}
          disabled={disabled || available === 0}
          data-testid={`button-book-${timeRange.replace(/:/g, '-')}`}
        >
          Забронировать
        </Button>
      </div>
    </Card>
  );
}

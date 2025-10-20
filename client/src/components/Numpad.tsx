import { Button } from '@/components/ui/button';
import { Delete } from 'lucide-react';

interface NumpadProps {
  onNumberClick: (num: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
}

export function Numpad({ onNumberClick, onBackspace, onClear }: NumpadProps) {
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'back'],
  ];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
      {buttons.map((row, i) => (
        row.map((btn, j) => {
          if (btn === 'back') {
            return (
              <Button
                key={`${i}-${j}`}
                size="lg"
                variant="secondary"
                className="h-16 text-xl"
                onClick={onBackspace}
                data-testid="button-numpad-backspace"
              >
                <Delete className="w-9 h-9" />
              </Button>
            );
          }
          if (btn === 'clear') {
            return (
              <Button
                key={`${i}-${j}`}
                size="lg"
                variant="ghost"
                className="h-16 text-lg"
                onClick={onClear}
                data-testid="button-numpad-clear"
              >
                C
              </Button>
            );
          }
          return (
            <Button
              key={`${i}-${j}`}
              size="lg"
              variant="outline"
              className="h-16 text-2xl font-semibold"
              onClick={() => onNumberClick(btn)}
              data-testid={`button-numpad-${btn}`}
            >
              {btn}
            </Button>
          );
        })
      ))}
    </div>
  );
}

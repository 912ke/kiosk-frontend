import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Numpad } from './Numpad';

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function PhoneField({ value, onChange, label = 'Телефон' }: PhoneFieldProps) {
  const [showNumpad, setShowNumpad] = useState(false);

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 0) return '+7 ';
    if (digits.length <= 1) return `+7 ${digits}`;
    if (digits.length <= 4) return `+7 ${digits.slice(1, 4)}`;
    if (digits.length <= 7) return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}`;
    if (digits.length <= 9) return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)}`;
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  };

  const handleNumberClick = (num: string) => {
    const currentDigits = value.replace(/\D/g, '');
    if (currentDigits.length < 11) {
      const newValue = currentDigits === '7' ? currentDigits + num : (currentDigits || '7') + num;
      onChange(formatPhone(newValue));
    }
  };

  const handleBackspace = () => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 1) {
      onChange(formatPhone(digits.slice(0, -1)));
    } else {
      onChange('+7 ');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-lg">{label}</Label>
        <Input
          value={value || '+7 '}
          readOnly
          onClick={() => setShowNumpad(true)}
          className="h-14 text-xl cursor-pointer"
          data-testid="input-phone"
        />
      </div>
      
      {showNumpad && (
        <div className="space-y-4">
          <Numpad
            onNumberClick={handleNumberClick}
            onBackspace={handleBackspace}
            onClear={() => onChange('+7 ')}
          />
        </div>
      )}
    </div>
  );
}

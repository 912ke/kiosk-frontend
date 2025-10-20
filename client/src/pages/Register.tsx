import { useState } from 'react';
import { KioskHeader } from '@/components/KioskHeader';
import { PhoneField } from '@/components/PhoneField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from 'wouter';
import { useClientStore } from '@/store/clientStore';

export default function Register() {
  const [, navigate] = useLocation();
  const { setClient } = useClientStore();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (!phone || !name || !agreed) return;
    
    setClient({ phone, name });
    console.log('Registration submitted:', { phone, name, email });
    navigate('/success?type=register');
  };

  const isValid = phone.replace(/\D/g, '').length === 11 && name.trim() && agreed;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <KioskHeader title="Регистрация" />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-8 space-y-8">
          <PhoneField value={phone} onChange={setPhone} />

          <div className="space-y-2">
            <Label className="text-lg">Имя *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              className="h-14 text-xl"
              data-testid="input-name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Email (необязательно)</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="h-14 text-xl"
              data-testid="input-email"
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1 w-6 h-6"
              data-testid="checkbox-agreement"
            />
            <label className="text-base text-muted-foreground cursor-pointer" onClick={() => setAgreed(!agreed)}>
              Я согласен с правилами клуба и политикой обработки персональных данных
            </label>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <Button
          size="lg"
          className="w-full h-16 text-xl"
          onClick={handleSubmit}
          disabled={!isValid}
          data-testid="button-submit-registration"
        >
          Завершить регистрацию
        </Button>
      </div>
    </div>
  );
}

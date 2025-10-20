import { useState } from 'react';
import { KioskHeader } from '@/components/KioskHeader';
import { PhoneField } from '@/components/PhoneField';
import { Numpad } from '@/components/Numpad';
import { QRDisplay } from '@/components/QRDisplay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { useDepositStore } from '@/store/depositStore';

export default function Deposit() {
  const [, navigate] = useLocation();
  const { amount, setAmount, setStatus } = useDepositStore();
  const [phone, setPhone] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const presetAmounts = [3000, 5000, 10000, 15000];

  const handleAmountSelect = (amt: number) => {
    setAmount(amt);
    setSelectedPreset(amt);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedPreset(null);
    const amt = parseInt(value);
    if (amt > 0) {
      setAmount(amt);
    } else {
      setAmount(0);
    }
  };

  const handlePayment = () => {
    console.log('Creating payment invoice:', { phone, amount });
    setShowQR(true);
  };

  const handlePaymentConfirm = () => {
    console.log('Payment confirmed');
    setStatus('success');
    navigate('/success?type=deposit');
  };

  if (showQR) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <KioskHeader showLogo />
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">₸{amount.toLocaleString()}</h2>
              <p className="text-muted-foreground">Пополнение депозита</p>
            </div>

            <QRDisplay
              data={`https://kaspi.kz/pay/simracing-${Date.now()}`}
              expiryMinutes={10}
              onExpired={() => {
                setShowQR(false);
                console.log('QR expired');
              }}
            />

            <Button
              size="lg"
              className="w-full h-16 text-xl"
              onClick={handlePaymentConfirm}
              data-testid="button-payment-confirm"
            >
              Я оплатил
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <KioskHeader showLogo />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-8 space-y-8">
          <PhoneField value={phone} onChange={setPhone} />

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg">Быстрый выбор суммы</Label>
              <div className="grid grid-cols-2 gap-4">
                {presetAmounts.map((amt) => (
                  <Button
                    key={amt}
                    size="lg"
                    variant={selectedPreset === amt ? 'default' : 'outline'}
                    className="h-16 text-xl"
                    onClick={() => handleAmountSelect(amt)}
                    data-testid={`button-amount-${amt}`}
                  >
                    ₸{(amt / 1000)}k
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">или</span>
              </div>
            </div>

            <Card className="p-6 space-y-4">
              <Label className="text-lg">Введите любую сумму</Label>
              <Input
                value={customAmount}
                readOnly
                className="h-16 text-3xl text-center font-bold"
                placeholder="0"
                data-testid="input-custom-amount"
              />
              <Numpad
                onNumberClick={(num) => handleCustomAmountChange(customAmount + num)}
                onBackspace={() => handleCustomAmountChange(customAmount.slice(0, -1))}
                onClear={() => handleCustomAmountChange('')}
              />
            </Card>
          </div>

          {amount > 0 && (
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-muted-foreground">Сумма к оплате</p>
              <p className="text-3xl font-bold text-primary">₸{amount.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <Button
          size="lg"
          className="w-full h-16 text-xl"
          onClick={handlePayment}
          disabled={!phone || !amount || phone.replace(/\D/g, '').length !== 11}
          data-testid="button-pay"
        >
          Оплатить Kaspi QR
        </Button>
      </div>
    </div>
  );
}

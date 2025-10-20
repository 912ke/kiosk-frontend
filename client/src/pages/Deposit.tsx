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
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const presetAmounts = [3000, 5000, 10000];

  const handleAmountSelect = (amt: number) => {
    setAmount(amt);
    setShowCustomAmount(false);
  };

  const handleCustomAmountSubmit = () => {
    const amt = parseInt(customAmount);
    if (amt > 0) {
      setAmount(amt);
      setShowCustomAmount(false);
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
        <KioskHeader title="Оплата Kaspi QR" />
        
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
      <KioskHeader title="Пополнение депозита" />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-8 space-y-8">
          <PhoneField value={phone} onChange={setPhone} />

          <div className="space-y-4">
            <Label className="text-lg">Сумма пополнения</Label>
            <div className="grid grid-cols-3 gap-4">
              {presetAmounts.map((amt) => (
                <Button
                  key={amt}
                  size="lg"
                  variant={amount === amt ? 'default' : 'outline'}
                  className="h-16 text-xl"
                  onClick={() => handleAmountSelect(amt)}
                  data-testid={`button-amount-${amt}`}
                >
                  ₸{(amt / 1000)}k
                </Button>
              ))}
            </div>
            <Button
              size="lg"
              variant={showCustomAmount ? 'default' : 'outline'}
              className="w-full h-16 text-xl"
              onClick={() => setShowCustomAmount(true)}
              data-testid="button-custom-amount"
            >
              Другая сумма
            </Button>
          </div>

          {showCustomAmount && (
            <Card className="p-6 space-y-4">
              <Label className="text-lg">Введите сумму</Label>
              <Input
                value={customAmount}
                readOnly
                className="h-14 text-2xl text-center"
                placeholder="0"
                data-testid="input-custom-amount"
              />
              <Numpad
                onNumberClick={(num) => setCustomAmount(prev => prev + num)}
                onBackspace={() => setCustomAmount(prev => prev.slice(0, -1))}
                onClear={() => setCustomAmount('')}
              />
              <Button
                size="lg"
                className="w-full h-14"
                onClick={handleCustomAmountSubmit}
                disabled={!customAmount || parseInt(customAmount) === 0}
                data-testid="button-confirm-custom-amount"
              >
                Подтвердить
              </Button>
            </Card>
          )}

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

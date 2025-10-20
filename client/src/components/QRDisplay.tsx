import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface QRDisplayProps {
  data: string;
  expiryMinutes?: number;
  onExpired?: () => void;
}

export function QRDisplay({ data, expiryMinutes = 10, onExpired }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        data,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('QR Code error:', error);
        }
      );
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="space-y-6">
      <Card className="bg-white p-8 flex items-center justify-center">
        <canvas ref={canvasRef} />
      </Card>
      
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Clock className="w-16 h-16" />
        <span className="text-lg">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      
      <p className="text-center text-muted-foreground">
        Отсканируйте QR-код вашим телефоном
      </p>
    </div>
  );
}

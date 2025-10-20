import { QRDisplay } from '../QRDisplay';

export default function QRDisplayExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-md">
        <QRDisplay
          data="https://kaspi.kz/pay/example123"
          expiryMinutes={5}
          onExpired={() => console.log('QR Code expired')}
        />
      </div>
    </div>
  );
}

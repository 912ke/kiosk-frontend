import { useState } from 'react';
import { PhoneField } from '../PhoneField';

export default function PhoneFieldExample() {
  const [phone, setPhone] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-md">
        <PhoneField value={phone} onChange={setPhone} />
      </div>
    </div>
  );
}

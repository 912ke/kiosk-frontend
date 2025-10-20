import { useState } from 'react';
import { Numpad } from '../Numpad';

export default function NumpadExample() {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 gap-6">
      <div className="text-4xl font-mono text-foreground min-h-16 flex items-center">
        {value || '0'}
      </div>
      <Numpad
        onNumberClick={(num) => setValue(prev => prev + num)}
        onBackspace={() => setValue(prev => prev.slice(0, -1))}
        onClear={() => setValue('')}
      />
    </div>
  );
}

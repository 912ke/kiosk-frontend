import { KioskHeader } from '../KioskHeader';

export default function KioskHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <KioskHeader 
        title="Бронирование" 
        onHelp={() => console.log('Help requested')}
      />
      <div className="p-8">
        <p className="text-muted-foreground text-center text-xl">
          Page content goes here
        </p>
      </div>
    </div>
  );
}

import { SlotCard } from '../SlotCard';

export default function SlotCardExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <SlotCard
          timeRange="12:00-13:00"
          available={5}
          price={2500}
          onBook={() => console.log('Booking 12:00-13:00')}
        />
        <SlotCard
          timeRange="13:30-14:30"
          available={2}
          price={2500}
          onBook={() => console.log('Booking 13:30-14:30')}
        />
        <SlotCard
          timeRange="15:00-16:00"
          available={0}
          price={2500}
          onBook={() => console.log('Booking 15:00-16:00')}
        />
      </div>
    </div>
  );
}

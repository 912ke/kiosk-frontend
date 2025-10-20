import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface NavigationTileProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClick: () => void;
  testId?: string;
}

export function NavigationTile({ icon: Icon, title, subtitle, onClick, testId }: NavigationTileProps) {
  return (
    <Card 
      className="hover-elevate active-elevate-2 cursor-pointer overflow-visible"
      onClick={onClick}
      data-testid={testId}
    >
      <Button
        variant="ghost"
        className="w-full h-full p-8 flex flex-col items-center justify-center gap-4 min-h-[200px] no-default-hover-elevate no-default-active-elevate"
        asChild
      >
        <div>
          <Icon className="w-48 h-48 text-primary" />
          <div className="text-center">
            <div className="text-2xl font-semibold">{title}</div>
            {subtitle && <div className="text-muted-foreground mt-1">{subtitle}</div>}
          </div>
        </div>
      </Button>
    </Card>
  );
}

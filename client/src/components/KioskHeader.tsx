import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import logoUrl from '@assets/burnoutz new white_1760952952425.png';

interface KioskHeaderProps {
  title?: string;
  onBack?: () => void;
  onHelp?: () => void;
  showLogo?: boolean;
}

export function KioskHeader({ title, onBack, onHelp, showLogo = false }: KioskHeaderProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Button
          size="lg"
          variant="ghost"
          onClick={handleBack}
          className="min-w-[56px]"
          data-testid="button-back"
        >
          <ArrowLeft className="w-18 h-18" />
        </Button>
        
        {showLogo ? (
          <div className="flex-1 flex justify-center">
            <img src={logoUrl} alt="Logo" className="w-1/3" />
          </div>
        ) : (
          <h1 className="text-2xl font-semibold text-center flex-1">{title}</h1>
        )}
        
        {onHelp ? (
          <Button
            size="lg"
            variant="ghost"
            onClick={onHelp}
            className="min-w-[56px]"
            data-testid="button-help"
          >
            <HelpCircle className="w-18 h-18" />
          </Button>
        ) : (
          <div className="min-w-[56px]" />
        )}
      </div>
    </header>
  );
}

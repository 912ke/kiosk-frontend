import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useUIStore } from '@/store/uiStore';

const IDLE_TIMEOUT = 60000;

export function IdleTimer() {
  const [location, navigate] = useLocation();
  const { lastActivity, updateActivity } = useUIStore();

  useEffect(() => {
    const events = ['mousedown', 'touchstart', 'keydown'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  useEffect(() => {
    if (location === '/') return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > IDLE_TIMEOUT) {
        navigate('/');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, location, navigate]);

  return null;
}

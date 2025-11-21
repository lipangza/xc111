import React, { useEffect, useState } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const IOSStatusBar: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(' ', ''));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex justify-between items-center text-white text-sm font-medium select-none pointer-events-none bg-gradient-to-b from-black/40 to-transparent">
      <div className="w-20 text-left">{time}</div>
      <div className="flex items-center gap-2">
        <Signal size={16} className="fill-current" />
        <Wifi size={16} />
        <Battery size={20} className="fill-white" />
      </div>
    </div>
  );
};